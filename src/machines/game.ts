import { setup, assign, sendTo, enqueueActions, stopChild } from "xstate";
import { produce, type Draft } from "immer";

import {
  managerCompetesIn,
  canOrderPrank,
  canCrisisMeeting,
  allEventsResolved,
  allRequiredActionsComplete,
  hasCompletedAction,
  humanManagers,
  activeManager,
  teamsManager,
  humanManagersTeam,
  humanManagerById
} from "@/machines/selectors";
import calendar, { type TurnPhase } from "@/data/calendar";
import competitionData from "@/data/competitions";
import { computeStats } from "@/services/competition-type";
import strategies, {
  SEASON_TICKETS_TAG,
  initialReadinessFor,
  type StrategyId
} from "@/data/mhm2000/strategies";
import prankTypes from "@/game/pranks";
import random, { cinteger } from "@/services/random";
import { tickArenaProject } from "@/services/arena-tick";
import { leagueTier, getAverageCharisma } from "@/services/team";
import { sellSeasonTickets } from "@/services/season-tickets";
import type { Arena } from "@/data/mhm2000/teams";
import {
  constructionRounds,
  qbCint,
  type BuildRank,
  type ProjectKind
} from "@/services/arena";
import { notificationsMachine } from "@/machines/notifications";
import type { NotificationData } from "@/machines/notification";
import { betMachine } from "@/machines/bet";
import { contractNegotiationMachine } from "@/machines/contractNegotiation";
import {
  sponsorNegotiationMachine,
  type SponsorNegotiationOutput
} from "@/machines/sponsorNegotiation";
import {
  crisisMeetingMachine,
  type CrisisMeetingOutput
} from "@/machines/crisisMeeting";
import type { CompetitionId } from "@/types/competitions";
import { values, entries } from "remeda";
import {
  autoLineup,
  assignPlayerToLineup,
  removeInvalidPlayersFromLineup
} from "@/services/lineup";
import type { LineupTarget } from "@/services/lineup";
import type { TeamBudget } from "@/data/mhm2000/budget";
import type { TeamServiceIdentifier } from "@/data/mhm2000/team-services";

import {
  applyEffects,
  type EventEffect,
  type NotifyFn
} from "@/game/event-effects";
import {
  runWorldChampionships,
  runFinalizeStats,
  runSeasonEnd
} from "@/machines/end-of-season";
import {
  eventRegistry,
  runInterpreter,
  spawnEvent
} from "@/machines/parts/events-engine";
import eventsMap from "@/game/events/table";
import { runGala } from "@/machines/parts/gala";
import { runGameday } from "@/machines/parts/gameday";
import { runSeasonStart } from "@/machines/parts/season-start";
import { createUniqueId } from "@/services/id";
import { expireMails, mailHandlers } from "@/game/mail-handlers";
import { runAiAction } from "@/game/ai-action";
import { replyToMail } from "@/game/mail-reply";
import { rollPostMatchEffects } from "@/game/post-match-effects";
import type { GameContext } from "@/state/game-context";
import {
  decrementPlayerEffects,
  expirePlayerEffects
} from "@/machines/parts/calculations/player-effects";

// Parlay payout multipliers moved to src/machines/bet.ts (where the
// payout is now computed). The bet actor reaches `resolved` and emits
// `BET_RESOLVED { effects }` which the root handler interprets.

/**
 * Resolve a single event, run its `process`, apply the resulting
 * effects, and mark it processed. Used by both `executeAutoResolveEvents`
 * (entry to the event phase) and `executeResolveEvent` (player action).
 *
 * Pure on `draft` — pulls the current event payload from the draft,
 * walks it through the event's `resolve` (if any) and `process`, and
 * writes the result + effects back into the draft.
 *
 * Pre-condition: `evtId` exists in `draft.event.events` and points at
 * an event whose definition exists in `eventRegistry`.
 */
function resolveAndProcess(
  draft: Draft<GameContext>,
  evtId: string,
  value: string,
  notify: NotifyFn
): void {
  const stored = draft.event.events[evtId];
  if (!stored) {
    return;
  }
  const def = eventRegistry[stored.eventId];
  if (!def) {
    return;
  }

  // Resolve only if the event isn't already resolved (some events
  // are pre-resolved at creation time — `pirka`, `bazookaStrike`,
  // anything where the data is fully determined up front). Cast
  // around the registry widening: `def.resolve` is typed against a
  // `BaseEventFields` payload; the stored event is `StoredEvent`
  // (BaseEventFields + extras), which the actual per-event resolve
  // knows how to read.
  if (!stored.resolved) {
    const resolved = def.resolve
      ? def.resolve(draft as GameContext, stored, value)
      : { ...stored, resolved: true };
    // Defensive: ensure the flag is set even if a buggy resolve forgets it.
    draft.event.events[evtId] = { ...resolved, resolved: true, id: evtId };
  }

  // Process. Apply the resulting effect list against the draft so
  // subsequent events in the same pass see the mutations.
  const effects = def.process(
    draft as GameContext,
    draft.event.events[evtId] as never
  );
  applyEffects(draft, effects, spawnEvent, notify);
  draft.event.events[evtId].processed = true;
}

/**
 * Game machine.
 *
 * Spawned by `appMachine` once the player has either finished the new-game
 * wizard or loaded a save. Receives a fully-formed `GameContext` as input;
 * owns the round/phase progression from there.
 *
 * The menu ↔ starting ↔ loading lifecycle lives in `appMachine`. Quitting
 * is handled at the app level (it stops this actor); this machine has no
 * concept of a "menu" to return to.
 */

export type ManagerSubmission = {
  name: string;
  arena: string;
  difficulty: number;
  team: number;
};

// One small alias to avoid repeating the generics
export type GameAssign<TParams = undefined> = ReturnType<
  typeof assign<
    GameContext,
    GameMachineEvents,
    TParams,
    GameMachineEvents,
    never
  >
>;

export type GameMachineEvents =
  | { type: "ADVANCE" }
  | { type: "END_TURN"; manager: string }
  | { type: "START_SPONSOR_NEGOTIATION"; manager: string }
  | {
      type: "SELECT_STRATEGY";
      payload: { manager: string; strategy: StrategyId };
    }
  | {
      type: "PLACE_BET";
      payload: { manager: string; coupon: string[]; amount: number };
    }
  | {
      type: "ORDER_PRANK";
      payload: { manager: string; type: string; victim: number };
    }
  | {
      type: "BUY_PLAYER";
      payload: { manager: string; playerType: number };
    }
  | {
      type: "SELL_PLAYER";
      payload: { manager: string; playerType: number };
    }
  | {
      type: "START_CRISIS_MEETING";
      payload: { manager: string };
    }
  | {
      type: "TEAM_INCUR_PENALTY";
      payload: {
        competition: CompetitionId;
        phase: number;
        group: number;
        team: number;
        penalty: number;
      };
    }
  | { type: "SAVED" }
  | { type: "DISMISS_NOTIFICATION"; id: string }
  | {
      type: "RESOLVE_EVENT";
      payload: { id: string; value: string };
    }
  | {
      type: "BET_RESOLVED";
      betId: string;
      effects: EventEffect[];
    }
  | {
      type: "NEGOTIATE_PLAYER";
      payload: {
        managerId: string;
        playerId: string;
        kind: "market" | "roster";
      };
    }
  | {
      type: "AUTO_LINEUP";
      payload: { manager: string };
    }
  | {
      type: "SET_OPTION_AUTOMATIC_LINES";
      payload: { manager: string; option: boolean };
    }
  | {
      type: "ASSIGN_PLAYER_TO_LINEUP";
      payload: {
        manager: string;
        target: LineupTarget;
        playerId: string | null;
      };
    }
  | {
      type: "SET_CAPTAIN";
      payload: {
        manager: string;
        playerId: string | undefined;
      };
    }
  | {
      type: "CONFIRM_BUDGET";
      payload: { manager: string; budget: TeamBudget };
    }
  | {
      type: "SET_TEAM_SERVICE";
      payload: {
        manager: string;
        service: TeamServiceIdentifier;
        level: number;
      };
    }
  | {
      type: "SET_INTENSITY";
      payload: {
        manager: string;
        intensity: 0 | 1 | 2;
      };
    }
  | {
      type: "SET_FIX_MATCH";
      payload: {
        manager: string;
        fixMatch: boolean;
      };
    }
  | {
      type: "TRANSFER_TO_ARENA_FUND";
      payload: {
        manager: string;
        amount: number;
      };
    }
  | {
      type: "START_ARENA_PROJECT";
      payload: {
        manager: string;
        kind: ProjectKind;
        target: Arena;
        builder: BuildRank;
        architect: BuildRank;
        name: string;
        totalCost: number;
      };
    }
  | { type: "DEBUG_GIMME_MONEY"; payload: { manager: string } }
  | {
      type: "REPLY_TO_MAIL";
      payload: { manager: string; mailId: string; answerKey: string };
    };

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    input: {} as GameContext,
    events: {} as GameMachineEvents
  },

  actors: {
    notifications: notificationsMachine,
    bet: betMachine,
    contractNegotiation: contractNegotiationMachine,
    sponsorNegotiation: sponsorNegotiationMachine,
    crisisMeeting: crisisMeetingMachine
  },

  actions: {
    advanceRound: enqueueActions(({ context, enqueue }) => {
      // Stop any parlay bets still parked in `placed` (rounds with no
      // league play never sent them `RESOLVE`, so they'd otherwise leak
      // — XState 5 spawned actors run until explicitly stopped, the GC
      // doesn't reach them via dropped context refs alone).
      for (const ref of context.betting.parlayBets) {
        enqueue(stopChild(ref.id));
      }
      enqueue.assign(
        produce(context, (draft) => {
          expirePlayerEffects(draft);

          for (const team of draft.teams) {
            team.effects = team.effects.filter((e) => e.duration > 0);
          }
          draft.betting.parlayBets = [];
          draft.news.news = [];
          draft.news.announcements = {};
          draft.turn.round += 1;
          draft.turn.activeTeams = [];
          draft.turn.activeManagers = [];

          // QB ILEX5.BAS:241 — kriisi = 0 at round start
          for (const m of values(draft.managers)) {
            if (m.kind === "human") {
              m.crisisMeetingHeld = false;
            }
          }

          for (const player of values(draft.transferMarket.players)) {
            player.tags = player.tags.filter(
              (t) => !t.startsWith("irritated:")
            );
          }
        })
      );
    }),

    /**
     * start-of-season setup — per-team and per-manager bookkeeping plus
     * competition reset. Slim wrapper around `runSeasonStart` in
     * [parts/season-start.ts](./parts/season-start.ts) — see there for
     * the per-competition behavior and saga lineage.
     */
    seasonStartSetup: assign(({ context }) =>
      produce(context, (draft) => {
        runSeasonStart(draft);
      })
    ),

    /**
     * select_strategy — sets the chosen strategy and rolls initial readiness
     * for the manager's team. 1-1 port of the legacy `selectStrategy()` saga.
     */
    selectStrategy: assign(
      ({ context }, params: { manager: string; strategy: StrategyId }) =>
        produce(context, (draft) => {
          const manager = draft.managers[params.manager];
          const teamIdx = manager?.team;
          if (teamIdx === undefined) {
            return;
          }
          // 1-1 with `SUB tremaar` (ILEX5.BAS:7458-7464): start tre()
          // from the strategy curve, then add the manager's STRATEGIAT
          // attribute bonus for non-flat strategies.
          draft.teams[teamIdx].strategy = params.strategy;
          draft.teams[teamIdx].readiness = initialReadinessFor(
            params.strategy,
            manager.attributes.strategy
          );
          if (manager.kind === "human") {
            manager.completedActions.push("strategy");
          }
        })
    ),

    /**
     * mailbox phase — walk every manager × tournament pair and
     * push an invitation for each one the manager is eligible for.
     * Replaces the previous season's invitation list wholesale (no
     * separate season-start clear needed). 1-1 port of the legacy
     * `createInvitations()` saga.
     *
     */
    executeMailbox: assign(({ context }) =>
      produce(context, (draft) => {
        mailHandlers.forEach((mailHandler) => {
          mailHandler(draft);
        });

        expireMails(draft);
      })
    ),

    /**
     * AI action phase — AI managers process their mailboxes and
     * auto-answer any pending RSVP mails. Runs after the human
     * action phase so humans always act first within the same turn.
     *
     * No UI — runs on `entry` and the state auto-advances.
     */
    executeAiAction: assign(({ context }) =>
      produce(context, (draft) => {
        runAiAction(draft);
      })
    ),

    /**
     * action phase — spawn a parlay bet actor for the chosen coupon and
     * debit the stake. The bet sits in `placed` until `executeGameday`
     * sends it `RESOLVE { correctCoupon }`; on resolution the bet emits
     * `BET_RESOLVED { effects }` which the root handler interprets.
     */
    placeBet: assign(
      (
        { context, spawn },
        params: { manager: string; coupon: string[]; amount: number }
      ) =>
        produce(context, (draft) => {
          const m = draft.managers[params.manager];

          if (!m) {
            return;
          }

          if (m.kind === "ai") {
            return;
          }

          m.balance -= params.amount;
          draft.betting.parlayBets.push(
            spawn("bet", {
              id: `bet-${createUniqueId()}`,
              input: {
                manager: params.manager,
                coupon: params.coupon,
                amount: params.amount
              }
            })
          );
        })
    ),

    /**
     * seed phase — for every `{ competition, phase }` entry in the current
     * round's calendar, run that competition's pure `seed[phase]` builder
     * and append the resulting `Phase` onto `competitions[id].phases`.
     *
     * 1-1 port of `sagas/phase/seed.ts` + `seedCompetition()` in
     * `sagas/game.ts`. Tournaments mirror their newly-built participant
     * list back to `comp.teams` (the legacy saga had a callback
     * indirection — `setCompetitionTeams` — for exactly this); league
     * competitions (PHL/division/EHL) keep their master roster
     * untouched, since playoff seeds produce bracket-sized team lists,
     * not full rosters.
     */
    executeSeedPhase: assign(({ context }) =>
      produce(context, (draft) => {
        const seeds = calendar[draft.turn.round]?.seed ?? [];
        for (const { competition, phase } of seeds) {
          const def = competitionData[competition];
          const newPhase = def.seed[phase](draft.competitions, draft);
          draft.competitions[competition].phases.push(newPhase);
          draft.competitions[competition].phase = phase;
          if (competition === "tournaments") {
            draft.competitions[competition].teams = newPhase.teams;
          }
          // Materialize initial stats for every group so the league tables
          // have something to render before the first gameday. 1-1 port of
          // the legacy `calculatePhaseStats` saga that ran on COMPETITION_SEED.
          for (const g of newPhase.groups) {
            g.stats = computeStats(g);
          }
        }
      })
    ),

    /**
     * order a prank — debits the manager, queues the prank, and bumps the
     * per-season counter. 1-1 port of the legacy `orderPrank()` saga +
     * `addCase(orderPrank)` in the manager duck. The actual gameday-side
     * effect (`pranks[type].execute`) still runs from the saga side.
     *
     * Notification is delivered separately via the `notify` action; UI
     * gating (`pranksPerSeason` cap, calendar `pranks` flag) stays in the
     * Pranks page.
     */
    executeOrderPrank: assign(
      (
        { context },
        params: { manager: string; type: string; victim: number }
      ) =>
        produce(context, (draft) => {
          const competesInPHL = managerCompetesIn(
            params.manager,
            "phl"
          )(context);
          const targetCompetition = competesInPHL ? "phl" : "division";
          const price = prankTypes[params.type].price(targetCompetition);

          const m = draft.managers[params.manager];
          if (!m) {
            return;
          }

          if (m.kind !== "human") {
            return;
          }

          m.balance -= price;
          m.pranksExecuted += 1;
          draft.prank.pranks.push({
            manager: params.manager,
            type: params.type,
            victim: params.victim
          });
        })
    ),

    /**
     * Run the auto-lineup builder for the manager's team.
     * Port of SUB automa (ILEX5.BAS:822-920).
     */
    executeAutoLineup: assign(({ context }, params: { manager: string }) =>
      produce(context, (draft) => {
        const m = draft.managers[params.manager];
        if (!m || m.team === undefined || m.kind === "ai") {
          return;
        }
        const team = draft.teams[m.team];
        if (team.kind !== "human") {
          return;
        }
        team.lineup = autoLineup(values(team.players));
      })
    ),

    /**
     * If the active manager has `automaticLineup` enabled, rebuild
     * the lineup. Chain after any roster-changing action.
     */
    autoLineupForActiveManager: assign(({ context }) =>
      produce(context, (draft) => {
        const m = activeManager(draft);
        if (m.kind !== "human" || !m.options.automaticLineup) {
          return;
        }
        const team = draft.teams[m.team!];
        if (!team || team.kind !== "human") {
          return;
        }
        team.lineup = autoLineup(values(team.players));
      })
    ),

    /**
     * Confirm budget for the manager's team.
     * Port of SUB budget (ILEX5.BAS:1104-1150), called at kiero3=4
     * during preseason — before strategy selection (kiero3=1).
     *
     * The organisaatio menu (key "o" in menu3) also shows this data
     * alongside erikoistoimenpiteet, but budget confirmation is a
     * season-start step.
     */
    executeConfirmBudget: assign(
      ({ context }, params: { manager: string; budget: TeamBudget }) =>
        produce(context, (draft) => {
          const m = draft.managers[params.manager];
          if (!m || m.team === undefined || m.kind === "ai") {
            return;
          }
          const team = draft.teams[m.team];
          team.budget = params.budget;
          m.completedActions.push("budget");
        })
    ),

    executeSetTeamService: assign(
      (
        { context },
        params: {
          manager: string;
          service: TeamServiceIdentifier;
          level: number;
        }
      ) =>
        produce(context, (draft) => {
          const m = draft.managers[params.manager];
          if (!m || m.team === undefined || m.kind === "ai") {
            return;
          }
          const team = draft.teams[m.team];
          team.services[params.service] = params.level;
        })
    ),

    executeSetIntensity: assign(
      (
        { context },
        params: {
          manager: string;
          intensity: 0 | 1 | 2;
        }
      ) =>
        produce(context, (draft) => {
          const m = draft.managers[params.manager];
          if (!m || m.team === undefined || m.kind === "ai") {
            return;
          }
          const team = draft.teams[m.team];
          team.intensity = params.intensity;
        })
    ),

    executeSetFixMatch: assign(
      (
        { context },
        params: {
          manager: string;
          fixMatch: boolean;
        }
      ) =>
        produce(context, (draft) => {
          const m = draft.managers[params.manager];
          if (!m || m.team === undefined || m.kind === "ai") {
            return;
          }
          const team = draft.teams[m.team];
          team.fixMatch = params.fixMatch;
        })
    ),

    executeSetOptionAutomaticLines: assign(
      (
        { context },
        params: {
          manager: string;
          option: boolean;
        }
      ) =>
        produce(context, (draft) => {
          const manager = humanManagerById(params.manager)(draft);
          manager.options.automaticLineup = params.option;

          // wire automatic lineup assignment here
        })
    ),

    /**
     * Move money from the manager's general balance into the team's
     * protected arena construction fund (`potti` in QB). One-way
     * transfer — there is no return path from potti back to raha;
     * once committed, the money stays until spent on construction
     * or wiped by a team swap. See ARENAS.md §3.
     */
    executeTransferToArenaFund: assign(
      (
        { context },
        params: {
          manager: string;
          amount: number;
        }
      ) =>
        produce(context, (draft) => {
          const m = draft.managers[params.manager];
          if (!m || m.team === undefined || m.kind === "ai") {
            return;
          }
          const clamped = Math.max(0, Math.min(params.amount, m.balance));
          if (clamped <= 0) {
            return;
          }
          m.balance -= clamped;
          draft.teams[m.team].arenaFund += clamped;
        })
    ),

    /**
     * Start an arena construction project. Called when the design wizard
     * confirms. Creates the `ManagerArenaProject` on the team and sets
     * up the initial state (permit phase for builds, construction for
     * renovations). No money is deducted at this point — the 20 % pantti
     * is a threshold check only (`potti >= 0.2 * cost`); actual spending
     * happens per-round via `mpv` instalments in `tickArenaProject`.
     */
    executeStartArenaProject: assign(
      (
        { context },
        params: {
          manager: string;
          kind: ProjectKind;
          target: Arena;
          builder: BuildRank;
          architect: BuildRank;
          name: string;
          totalCost: number;
        }
      ) =>
        produce(context, (draft) => {
          const m = draft.managers[params.manager];
          if (!m || m.team === undefined || m.kind === "ai") {
            return;
          }
          const team = draft.teams[m.team];
          if (team.arenaProject) {
            return;
          } // already have a project

          if (params.kind === "renovate") {
            const rounds = constructionRounds("renovate", params.builder);
            team.arenaProject = {
              kind: "renovate",
              builder: params.builder,
              roundsRemaining: rounds,
              roundPayment: qbCint(params.totalCost / rounds),
              target: params.target
            };
          } else {
            // Build: start in permit phase (roundsRemaining = 10,
            // permitGranted = false). roundPayment holds total cost
            // until the permit is granted, then gets split into
            // per-round chunks by tickArenaProject.
            team.arenaProject = {
              kind: "build",
              name: params.name,
              architect: params.architect,
              builder: params.builder,
              permitGranted: false,
              roundsRemaining: 10,
              roundPayment: params.totalCost,
              target: params.target
            };
          }
        })
    ),

    /**
     * Set the team captain. Stored on the lineup since it's a
     * human-team-only concern tied to the lineup configuration.
     */
    executeSetCaptain: assign(
      (
        { context },
        params: { manager: string; playerId: string | undefined }
      ) =>
        produce(context, (draft) => {
          const m = draft.managers[params.manager];
          if (!m || m.team === undefined || m.kind === "ai") {
            return;
          }
          const team = draft.teams[m.team];
          if (team.kind !== "human") {
            return;
          }
          team.lineup.captain = params.playerId;
        })
    ),

    /**
     * Assign a single player to a specific lineup slot.
     * Enforces the QB `ketlaita` guard: max 2 regular-line appearances.
     */
    executeAssignPlayerToLineup: assign(
      (
        { context },
        params: {
          manager: string;
          target: LineupTarget;
          playerId: string | null;
        }
      ) =>
        produce(context, (draft) => {
          const m = draft.managers[params.manager];
          if (!m || m.team === undefined || m.kind === "ai") {
            return;
          }
          const team = draft.teams[m.team];
          if (team.kind !== "human") {
            return;
          }
          assignPlayerToLineup(
            team.lineup,
            params.target,
            params.playerId,
            team.players
          );
        })
    ),

    /**
     * Apply a points penalty to a team in a round-robin group, then
     * recompute that group's stats so the standings reflect it
     * immediately. 1-1 port of the legacy `incurPenalty()` saga (which
     * dispatched `teamIncurPenalty` followed by `calculateGroupStats`).
     *
     * Penalties only exist on round-robin groups; other group types
     * silently no-op.
     */
    executeIncurPenalty: assign(
      (
        { context },
        params: {
          competition: CompetitionId;
          phase: number;
          group: number;
          team: number;
          penalty: number;
        }
      ) =>
        produce(context, (draft) => {
          const g =
            draft.competitions[params.competition].phases[params.phase].groups[
              params.group
            ];
          if (g.type !== "round-robin") {
            return;
          }
          g.penalties.push({ team: params.team, penalty: params.penalty });
          g.stats = computeStats(g);
        })
    ),

    /**
     * Play one round of every gameday listed in `calendar[round].gamedays`.
     *
     * Folds the legacy `gameday()` saga + its `completeGameday` helper:
     * for each group, simulate every match where `playMatch` returns true,
     * recompute stats, then run the per-manager `afterGameday`
     * bookkeeping (microphone roll → fine + announcement, plus
     *  moraleBoost), then bump the group's
     * round counter.
     *
     * Still TODO and intentionally NOT in this step:
     *   - `bettingResults` (PHL group 0 only — parlay payouts)
     *   - `groupEnd` (ehl medalists, tournament prizes)
     *
     * Tournaments (and only tournaments — by game-design invariant, regular
     * competitions never share a round with a tournament) play many rounds
     * across this phase. The compound `gameday` state handles that by
     * looping `preview → play → results → preview` until the
     * `tournamentHasMoreRounds` guard returns false.
     */
    executeGameday: enqueueActions(({ context, enqueue }) => {
      runInterpreter(context, enqueue, (draft, notify) => {
        const effects = runGameday(draft);

        applyEffects(draft, effects, spawnEvent, notify);
      });
    }),

    /* assign(({ context }) =>
      produce(context, (draft) => {
        runGameday(draft);
      })
    ),*/

    /**
     * Bridge between `executeGameday` and the parlay bet actors.
     * Reads `betting.lastLeagueCoupon` (set by `runGameday` when the
     * PHL phase-0 group-0 round runs), dispatches `RESOLVE` to every
     * parlay bet, and clears the field. Each bet computes its payout,
     * transitions to `resolved`, and emits `BET_RESOLVED { effects }`
     * which the root handler interprets via `runInterpreter`.
     */
    resolveParlayBets: enqueueActions(({ context, enqueue }) => {
      const coupon = context.betting.lastLeagueCoupon;
      if (!coupon) {
        return;
      }
      for (const ref of context.betting.parlayBets) {
        enqueue.sendTo(ref, {
          type: "RESOLVE" as const,
          correctCoupon: coupon
        });
      }
      enqueue.assign(
        produce(context, (draft) => {
          draft.betting.lastLeagueCoupon = undefined;
        })
      );
    }),

    /**
     * Calculations phase — per-team readiness drift from the chosen
     * strategy, per-manager service costs, then duration ticks on every
     * active team effect. 1-1 port of `calculationsPhase()` in
     * `src/sagas/phase/calculations.ts` + the `decrementDurations`
     * reducer case.
     *
     * No UI — runs on `entry` and the state auto-advances.
     */
    executeCalculations: enqueueActions(({ context, enqueue }) => {
      runInterpreter(context, enqueue, (draft, notify) => {
        // Per-team: strategy-driven readiness drift — ONLY on regular-
        // season runkosarja gamedays. QB: ILEX5.BAS:1574 sits inside
        // `CASE 1` of `SELECT CASE kiero(kr)`, so EHL/cup/playoff/
        // training/preseason rounds get NO drift.
        const entry = calendar[draft.turn.round];
        if (!entry) {
          throw new Error("Grand error in turn handling");
        }

        if (entry.readinessDrift) {
          for (const team of draft.teams) {
            const strategy = team.strategy as StrategyId;
            const delta = strategies[strategy]?.incrementReadiness() ?? 0;
            if (delta !== 0) {
              team.readiness += delta;
            }
          }
        }

        // Tick durations on every active effect (team + opponent).
        // Expired effects (duration <= 0 after the tick) are pruned by
        // `advanceRound` at end of round.
        for (const team of draft.teams) {
          for (const e of team.effects) {
            e.duration -= 1;
          }
        }

        decrementPlayerEffects(draft);

        // Season-ticket drive — QB `kausikorttimaar`. Runs on every
        // preseason round tagged `season_tickets` (10 batches total).
        // Iterates all 48 league teams (PHL + Div + Mut), sells one
        // batch per team, accumulates `seasonTickets`, and credits
        // revenue to the team's human manager (if any).
        const roundTags = entry.tags;
        if (roundTags.includes(SEASON_TICKETS_TAG)) {
          for (const team of draft.teams) {
            const tier = leagueTier(team.id, draft.competitions);
            if (tier === undefined) {
              continue; // light team — not in the league ladder
            }

            const rankings = team.previousRankings;
            if (!rankings) {
              throw new Error("Rankings fail");
            }

            const formAverage =
              (rankings[0] * 2 + rankings[1] + rankings[2]) / 4;

            const result = sellSeasonTickets({
              seatedCount: team.arena.seatedCount,
              seasonTickets: team.seasonTickets,
              tier,
              formAverage,
              arenaLevel: team.arena.level,
              managerCharisma:
                team.manager != null
                  ? (draft.managers[team.manager]?.attributes.charisma ?? 0)
                  : 0,
              rosterCharismaAvg: getAverageCharisma(team),
              random
            });

            team.seasonTickets += result.ticketsSold;

            // Credit revenue to the human manager (QB: raha(ohj) += d * lhinta * 22)
            if (team.manager != null) {
              const mgr = draft.managers[team.manager];
              if (mgr?.kind === "human") {
                mgr.balance += result.revenue;
              }
            }
          }
        }

        for (const [i, team] of draft.teams.entries()) {
          const result = tickArenaProject(team, random);

          const manager = teamsManager(i)(draft);
          if (manager.kind === "human") {
            if (result.news.length > 0) {
              for (const message of result.news) {
                // todo: mail
                notify({
                  manager: manager.id,
                  message,
                  type: "arena"
                });
              }
            }
          }
        }
      });
    }),

    /**
     * Event creation phase. Two concerns, two gates:
     *
     * 1. **Post-match `dap` rolls** (injury / mood / suspension) — fire
     *    for every human manager who played a match this turn. Gated by
     *    `turn.activeManagers` (populated by `runGameday`). Fires on
     *    ALL round types (runkosarja, EHL, cup, playoffs).
     *    QB source: ILEX5.BAS:5634-5650 (`dap` CASE 1/2/3 in `sattuma`).
     *
     * 2. **Story event creation** — the big `dat%` lottery. Gated by the
     *    `createRandomEvent` calendar boolean (regular season only).
     *    Currently MHM 97 legacy; will be replaced with MHM 2000 events.
     *
     * No UI — runs on `entry` and the state auto-advances.
     */
    executeEventCreation: assign(({ context }) =>
      produce(context, (draft) => {
        // ── Post-match dap rolls (all round types with matches) ──
        for (const managerId of draft.turn.activeManagers) {
          const manager = draft.managers[managerId];
          if (!manager || manager.kind !== "human") {
            continue;
          }

          const effects = rollPostMatchEffects(draft, managerId, random);
          applyEffects(draft, effects, spawnEvent, () => {});
        }

        // ── Story events (regular season only) ──
        const entry = calendar[draft.turn.round];
        if (entry?.createRandomEvent) {
          for (const manager of values(humanManagers(draft))) {
            // MHM 97 legacy, will be replaced with MHM 2000 events.
            const eventNumber = cinteger(1, 335);
            const eventName = eventsMap[eventNumber];

            if (!eventName) {
              continue;
            }

            // `spawnEvent` no-ops if the event isn't registered yet
            // (most of `eventsMap` until porting completes).
            spawnEvent(draft, eventName, { manager: manager.id });
          }
        }
      })
    ),

    /**
     * Event phase entry — walk every unprocessed event and handle it:
     *   - already-resolved events (e.g. `pirka`, prank-spawned
     *     `bazookaStrike`) → process only.
     *   - unresolved + no `options()` → resolve auto + process.
     *   - unresolved + has `options()` → skip; interactive, wait for
     *     `RESOLVE_EVENT`.
     *
     * Mirrors the deleted saga's two-pass approach (auto-resolve loop in
     * `phase/event.ts` + `processEvents()` in `event.ts`)
     * collapsed into a single walk.
     * "Auto-resolve?" is now a property of the event definition (no
     * `options`) rather than an `autoResolve` flag baked into each
     * payload by the create function.
     */
    executeAutoResolveEvents: enqueueActions(({ context, enqueue }) => {
      runInterpreter(context, enqueue, (draft, notify) => {
        for (const [id, evt] of entries(draft.event.events)) {
          if (evt.processed) {
            continue;
          }
          const def = eventRegistry[evt.eventId];
          if (!def) {
            continue;
          }
          // Interactive event still waiting on the player.
          if (!evt.resolved && def.options) {
            continue;
          }
          resolveAndProcess(draft, id, "auto", notify);
        }
      });
    }),

    /**
     * Player resolved one interactive event. Look it up, run its
     * `resolve` (which may roll random — that's where rolls live in
     * the new system), apply effects from `process`, mark processed.
     *
     * 1-1 port of the deleted `requestResolveEvent` → `resolveEvent` flow
     * in `src/sagas/event.ts`.
     */
    executeResolveEvent: enqueueActions(
      ({ context, enqueue }, params: { id: string; value: string }) => {
        runInterpreter(context, enqueue, (draft, notify) => {
          resolveAndProcess(draft, params.id, params.value, notify);
        });
      }
    ),

    /**
     * End-of-season: world championships. Recompute Pekkalandia
     * (FI) strength as the PHL average, then roll luck + random per
     * country and snapshot the sorted standings into
     * `worldChampionshipResults` + `stats.currentSeason.worldChampionships`.
     */
    executeWorldChampionships: assign(({ context }) =>
      produce(context, (draft) => {
        runWorldChampionships(draft, random);
      })
    ),

    /**
     * End-of-season: finalize season stats (presidents trophy, medalists,
     * promoted/relegated when distinct, per-manager stories).
     */
    executeFinalizeSeasonStats: assign(({ context }) =>
      produce(context, (draft) => {
        runFinalizeStats(draft);
      })
    ),

    /**
     * End-of-season: commit currentSeason → seasons[], promote/relegate,
     * bump season counter, set round to -1 so `advanceRound` rolls back
     * to 0 for the new season.
     */
    executeSeasonEnd: assign(({ context }) =>
      produce(context, (draft) => {
        runSeasonEnd(draft, random);
      })
    ),

    /**
     * Wipe the event queue. Runs on exit from the event phase so the
     * resolved/processed cards stay visible until the player advances
     * out of the phase. Saga equivalent: `clearEvents()` inside
     * `nextTurn()` at end of round.
     */
    executeClearEvents: assign(({ context }) =>
      produce(context, (draft) => {
        draft.event.events = {};
      })
    ),

    /**
     * Gala phase entry — push a stack of news strings narrating the
     * upcoming PHL/division finals before the player enters the final
     * round. 1-1 port of `src/sagas/phase/gala.ts` (REFERENCE-ONLY
     * post-pivot).
     *
     * Reads PHL regular-season + finals brackets, division finals +
     * regular-season brackets, then describes home advantage,
     * favorites, bronze pairing, division ranking surprises, etc.
     *
     * No randomness in the news lines themselves; `randomManager()`
     * is used only as a fallback when an unmanaged team reaches the
     * final.
     */
    executeGalaPhase: assign(({ context }) =>
      produce(context, (draft) => {
        return runGala(draft);
      })
    ),

    /**
     * Prank phase entry — execute every queued prank, applying its
     * effect list (mostly `spawnEvent` → an event lands in
     * `event.events` for the upcoming event phase; `fixedMatch` →
     * direct team-effect debuff). Then clear the queue.
     *
     * 1-1 port of `src/sagas/phase/prank.ts` (REFERENCE-ONLY
     * post-pivot). The `prankExecutor`/`dismissPrank(prankId)` two-step
     * is collapsed into one immer pass.
     *
     * No UI — runs on `entry` and the state auto-advances.
     */
    executePranks: enqueueActions(({ context, enqueue }) => {
      runInterpreter(context, enqueue, (draft, notify) => {
        for (const prank of draft.prank.pranks) {
          const def = prankTypes[prank.type];
          if (!def) {
            continue;
          }
          applyEffects(draft, def.execute(draft, prank), spawnEvent, notify);
        }
        draft.prank.pranks = [];
      });
    }),

    /**
     * Generic notification dispatcher — forwards a fully-formed notification
     * to the invoked `notifications` child machine. Call sites build the
     * message; this action only handles the delivery + id assignment.
     */
    notify: sendTo(
      "notifications",
      (
        _,
        params: {
          notification: Omit<NotificationData, "id"> & { timeout?: number };
        }
      ) => ({
        type: "PUSH" as const,
        notification: { id: createUniqueId(), ...params.notification }
      })
    )
  },

  guards: {
    is_start_of_season: ({ context }) => context.turn.round === 0,

    is_end_of_season: ({ context }) =>
      context.turn.round === calendar.length - 1,

    has_seeds: ({ context }) => calendar[context.turn.round].seed.length > 0,

    has_gamedays: ({ context }) =>
      calendar[context.turn.round].gamedays.length > 0,

    has_pranks: ({ context }) => calendar[context.turn.round].pranks,

    has_phase: ({ context }, params: { phase: TurnPhase }) =>
      calendar[context.turn.round]?.phases.includes(params.phase) ?? false,
    calendar_in_bounds: ({ context }) => context.turn.round < calendar.length,
    /**
     * True iff any group in any of the round's gamedays still has rounds
     * left in its schedule. By game-design invariant, this is only ever
     * true for tournaments — regular competitions exhaust their schedule
     * in the single round dedicated to them in the calendar.
     */
    allActionsComplete: ({ context }) => allRequiredActionsComplete(context),
    tournamentHasMoreRounds: ({ context }) => {
      const gamedays = calendar[context.turn.round]?.gamedays ?? [];
      for (const id of gamedays) {
        const comp = context.competitions[id];
        const phase = comp.phases[comp.phase];
        // Only tournaments play multiple rounds in a single gameday phase.
        // Round-robin (PHL/division/EHL) plays one schedule-round per
        // calendar gameday, no matter how many rounds the schedule has.
        if (phase.type !== "tournament") {
          continue;
        }
        for (const group of phase.groups) {
          if (group.round < group.schedule.length) {
            return true;
          }
        }
      }
      return false;
    }
  }
}).createMachine({
  id: "game",
  initial: "in_game",
  context: ({ input }) => input,
  invoke: [
    {
      src: "notifications",
      id: "notifications",
      systemId: "notifications",
      input: { defaultTimeout: 7000 }
    }
  ],
  on: {
    DISMISS_NOTIFICATION: {
      actions: sendTo("notifications", ({ event }) => ({
        type: "DISMISS",
        id: event.id
      }))
    },
    ORDER_PRANK: {
      // Mirror of the `Pranks.tsx` Calendar gate + per-type affordability
      // check in `SelectType`. Price is resolved here (selectors can't
      // import `@/game/pranks` without dragging the whole saga graph in).
      guard: ({ context, event }) => {
        const competesInPHL = managerCompetesIn(
          event.payload.manager,
          "phl"
        )(context);
        const competition = competesInPHL ? "phl" : "division";
        const prank = prankTypes[event.payload.type];
        if (!prank) {
          return false;
        }
        return canOrderPrank(
          event.payload.manager,
          prank.price(competition)
        )(context);
      },
      actions: [
        {
          type: "executeOrderPrank",
          params: ({ event }) => event.payload
        },
        {
          type: "notify",
          params: ({ event }) => ({
            notification: {
              manager: event.payload.manager,
              message: prankTypes[event.payload.type].orderMessage({
                manager: event.payload.manager,
                type: event.payload.type,
                victim: event.payload.victim
              }),
              type: "info"
            }
          })
        }
      ]
    },
    TEAM_INCUR_PENALTY: {
      actions: {
        type: "executeIncurPenalty",
        params: ({ event }) => event.payload
      }
    },
    AUTO_LINEUP: {
      actions: {
        type: "executeAutoLineup",
        params: ({ event }) => event.payload
      }
    },
    ASSIGN_PLAYER_TO_LINEUP: {
      actions: {
        type: "executeAssignPlayerToLineup",
        params: ({ event }) => event.payload
      }
    },
    SET_CAPTAIN: {
      actions: {
        type: "executeSetCaptain",
        params: ({ event }) => event.payload
      }
    },
    SET_TEAM_SERVICE: {
      actions: {
        type: "executeSetTeamService",
        params: ({ event }) => event.payload
      }
    },
    SET_INTENSITY: {
      actions: {
        type: "executeSetIntensity",
        params: ({ event }) => event.payload
      }
    },
    SET_FIX_MATCH: {
      actions: {
        type: "executeSetFixMatch",
        params: ({ event }) => event.payload
      }
    },
    SET_OPTION_AUTOMATIC_LINES: {
      actions: [
        {
          type: "executeSetOptionAutomaticLines",
          params: ({ event }) => event.payload
        },
        {
          type: "executeAutoLineup",
          params: ({ event }) => event.payload
        }
      ]
    },

    TRANSFER_TO_ARENA_FUND: {
      actions: {
        type: "executeTransferToArenaFund",
        params: ({ event }) => event.payload
      }
    },
    START_ARENA_PROJECT: {
      actions: {
        type: "executeStartArenaProject",
        params: ({ event }) => event.payload
      }
    },
    DEBUG_GIMME_MONEY: {
      actions: assign(({ context, event }) =>
        produce(context, (draft) => {
          const m = draft.managers[event.payload.manager];
          if (m && m.kind === "human") {
            m.balance += 10_000_000;
          }
        })
      )
    },
    REPLY_TO_MAIL: {
      actions: assign(({ context, event }) =>
        produce(context, (draft) => {
          replyToMail(
            draft,
            event.payload.manager,
            event.payload.mailId,
            event.payload.answerKey
          );
        })
      )
    },
    PLACE_BET: {
      actions: [
        {
          type: "placeBet",
          params: ({ event }) => event.payload
        },
        {
          type: "notify",
          params: ({ event }) => ({
            notification: {
              manager: event.payload.manager,
              message:
                "Kiikutat veikkauskuponkisi lähimmälle S-kioskille. Olkoon onni myötä!",
              type: "info"
            }
          })
        }
      ]
    },
    SAVED: {
      actions: {
        type: "notify",
        params: ({ context }) => ({
          notification: {
            manager: context.human.active!,
            message: "Peli tallennettiin.",
            type: "info"
          }
        })
      }
    },
    BET_RESOLVED: {
      // A spawned bet actor (parlay or champion) has reached its
      // `resolved` final state. Interpret its `effects`, drop the ref
      // from whichever list it lived in, and stop the child to release
      // its system-level registration. Filtering both lists is fine —
      // the non-matching list filter is a no-op.
      actions: enqueueActions(({ context, enqueue, event }) => {
        runInterpreter(context, enqueue, (draft, notify) => {
          applyEffects(draft, event.effects, spawnEvent, notify);
        });
        // Callback form so this assign sees the context produced by
        // `runInterpreter` above, not the original closed-over `context`.
        enqueue.assign({
          betting: ({ context }) =>
            produce(context.betting, (draft) => {
              draft.parlayBets = draft.parlayBets.filter(
                (ref) => ref.id !== event.betId
              );
            })
        });
        enqueue(stopChild(event.betId));
      })
    }
  },
  states: {
    in_game: {
      initial: "executing_phases",
      states: {
        executing_phases: {
          initial: "action_check",
          states: {
            action_check: {
              always: [
                {
                  guard: { type: "has_phase", params: { phase: "action" } },
                  target: "action"
                },
                { target: "prank_check" }
              ]
            },
            action: {
              entry: assign(({ context }) =>
                produce(context, (draft) => {
                  for (const team of values(draft.teams)) {
                    if (team.kind !== "human" || !team.manager) {
                      continue;
                    }
                    const manager = draft.managers[team.manager];
                    if (
                      manager?.kind === "human" &&
                      manager.options.automaticLineup
                    ) {
                      team.lineup = autoLineup(values(team.players));
                    } else {
                      removeInvalidPlayersFromLineup(team.lineup, team.players);
                    }
                  }
                })
              ),
              initial: "browsing",
              onDone: "ai_action_check",
              states: {
                browsing: {
                  on: {
                    NEGOTIATE_PLAYER: {
                      guard: ({ context, event }) =>
                        hasCompletedAction(
                          event.payload.managerId,
                          "budget"
                        )(context),
                      target: "negotiating"
                    },

                    START_SPONSOR_NEGOTIATION: {
                      guard: ({ context, event }) =>
                        !hasCompletedAction(event.manager, "sponsor")(context),
                      target: "sponsorNegotiating"
                    },
                    START_CRISIS_MEETING: {
                      guard: ({ context, event }) =>
                        canCrisisMeeting(event.payload.manager)(context),
                      target: "crisisMeeting"
                    },
                    CONFIRM_BUDGET: {
                      actions: {
                        type: "executeConfirmBudget",
                        params: ({ event }) => event.payload
                      }
                    },
                    SELECT_STRATEGY: {
                      actions: {
                        type: "selectStrategy",
                        params: ({ event }) => event.payload
                      }
                    },
                    END_TURN: [
                      { guard: "allActionsComplete", target: "done" },
                      {
                        actions: {
                          type: "notify",
                          params: ({ event }) => ({
                            notification: {
                              manager: event.manager,
                              message:
                                "Et voi edetä ennen kuin kaikki pakolliset toimenpiteet on suoritettu!",
                              type: "warning"
                            }
                          })
                        }
                      }
                    ]
                  }
                },
                negotiating: {
                  invoke: {
                    src: "contractNegotiation",
                    id: "contractNegotiation",
                    systemId: "contractNegotiation",
                    input: ({ context, event }) => {
                      if (event.type !== "NEGOTIATE_PLAYER") {
                        throw new Error("negotiating entered from wrong event");
                      }
                      const { managerId, playerId } = event.payload;
                      const manager = context.managers[managerId];

                      const team = humanManagersTeam(managerId)(context);

                      const player =
                        event.payload.kind === "market"
                          ? context.transferMarket.players[playerId]
                          : team.players[playerId];

                      if (
                        !manager ||
                        manager.kind !== "human" ||
                        !player ||
                        !team ||
                        team.kind !== "human" ||
                        !team.budget
                      ) {
                        throw new Error("negotiation preconditions not met");
                      }

                      return {
                        player,
                        manager,
                        budget: team.budget,
                        alreadyNegotiated: player.tags.some(
                          (t) => t === `irritated:${managerId}`
                        ),
                        random
                      };
                    },
                    onDone: [
                      {
                        guard: ({ event }) =>
                          event.output.outcome === "cancelled",
                        target: "browsing"
                      },
                      {
                        actions: enqueueActions(
                          ({ enqueue, event, context }) => {
                            runInterpreter(
                              context,
                              enqueue,
                              (draft, notify) => {
                                applyEffects(
                                  draft,
                                  event.output.effects,
                                  spawnEvent,
                                  notify
                                );
                              }
                            );
                            enqueue({ type: "autoLineupForActiveManager" });
                          }
                        ),
                        target: "browsing"
                      }
                    ]
                  }
                },
                sponsorNegotiating: {
                  invoke: {
                    src: "sponsorNegotiation",
                    id: "sponsorNegotiation",
                    systemId: "sponsorNegotiation",
                    input: ({ context, event }) => {
                      if (event.type !== "START_SPONSOR_NEGOTIATION") {
                        throw new Error(
                          "sponsorNegotiating entered from wrong event"
                        );
                      }
                      const manager = context.managers[event.manager];
                      if (!manager || manager.kind !== "human") {
                        throw new Error("sponsor negotiation: invalid manager");
                      }
                      const team =
                        manager.team !== undefined
                          ? context.teams[manager.team]
                          : undefined;
                      if (!team || team.kind !== "human") {
                        throw new Error("sponsor negotiation: invalid team");
                      }
                      return {
                        manager,
                        team,
                        competitions: context.competitions,
                        random
                      };
                    },
                    onDone: {
                      actions: assign(({ context, event }) =>
                        produce(context, (draft) => {
                          const { deal } =
                            event.output as SponsorNegotiationOutput;
                          const managerId = draft.human.active;
                          if (!managerId) {
                            return;
                          }
                          const m = draft.managers[managerId];
                          if (!m || m.kind !== "human") {
                            return;
                          }
                          m.sponsor = deal;
                          m.completedActions.push("sponsor");
                        })
                      ),
                      target: "browsing"
                    }
                  }
                },
                crisisMeeting: {
                  invoke: {
                    src: "crisisMeeting",
                    id: "crisisMeeting",
                    systemId: "crisisMeeting",
                    input: ({ context, event }) => {
                      if (event.type !== "START_CRISIS_MEETING") {
                        throw new Error(
                          "crisisMeeting entered from wrong event"
                        );
                      }
                      const managerId = event.payload.manager;
                      const manager = context.managers[managerId];
                      if (!manager || manager.kind !== "human") {
                        throw new Error("crisis meeting: invalid manager");
                      }
                      const teamIndex = manager.team;
                      const team =
                        teamIndex !== undefined
                          ? context.teams[teamIndex]
                          : undefined;
                      if (!team || team.kind !== "human") {
                        throw new Error("crisis meeting: invalid team");
                      }
                      return {
                        team,
                        managerId,
                        teamIndex: teamIndex!,
                        managerAttributes: manager.attributes,
                        random
                      };
                    },
                    onDone: [
                      {
                        guard: ({ event }) =>
                          (event.output as CrisisMeetingOutput).outcome ===
                          "cancelled",
                        target: "browsing"
                      },
                      {
                        actions: enqueueActions(
                          ({ enqueue, event, context }) => {
                            const output = event.output as CrisisMeetingOutput;
                            if (output.outcome !== "completed") {
                              return;
                            }
                            const { result } = output;

                            runInterpreter(
                              context,
                              enqueue,
                              (draft, notify) => {
                                applyEffects(
                                  draft,
                                  result.effects,
                                  spawnEvent,
                                  notify
                                );

                                const m = activeManager(draft);
                                m.crisisMeetingHeld = true;
                              }
                            );
                            enqueue({ type: "autoLineupForActiveManager" });
                          }
                        ),
                        target: "browsing"
                      }
                    ]
                  }
                },
                done: { type: "final" }
              }
            },

            ai_action_check: {
              always: [
                {
                  guard: {
                    type: "has_phase",
                    params: { phase: "action" }
                  },
                  target: "ai_action"
                },
                { target: "prank_check" }
              ]
            },
            // AI action phase — AI managers process their mailboxes,
            // auto-answer RSVPs, and handle any other per-turn decisions.
            // Runs after the human action phase so humans always act first.
            // Auto-advances; no UI.
            ai_action: {
              entry: "executeAiAction",
              always: "prank_check"
            },

            prank_check: {
              always: [
                {
                  guard: "has_pranks",
                  target: "prank"
                },
                { target: "gameday_check" }
              ]
            },
            // Prank phase — execute every queued prank in one pass.
            // Most pranks `spawnEvent` so their fallout lands in the
            // upcoming event phase; `fixedMatch` directly debuffs the
            // victim. Auto-advances; no UI.
            prank: {
              entry: "executePranks",
              always: "gameday_check"
            },

            gameday_check: {
              always: [
                {
                  guard: { type: "has_gamedays" },
                  target: "gameday"
                },
                { target: "calculations" }
              ]
            },
            // Compound gameday state: the user previews the matches,
            // advances to start the simulation, then sees the results and
            // advances again to leave the phase. `play` is transient — its
            // `entry` will run the simulation synchronously once the
            // gameday port lands; for now it just falls through so the
            // existing saga keeps doing the work.
            gameday: {
              initial: "preview",
              onDone: "calculations",
              states: {
                preview: {
                  on: { ADVANCE: "play" }
                },
                play: {
                  entry: ["executeGameday", "resolveParlayBets"],
                  always: "results"
                },
                results: {
                  on: {
                    ADVANCE: [
                      // Tournament still has rounds left — loop back so the
                      // user sees the next round's preview.
                      {
                        guard: "tournamentHasMoreRounds",
                        target: "preview"
                      },
                      // All scheduled play done — exit the gameday phase.
                      { target: "done" }
                    ]
                  }
                },
                done: { type: "final" }
              }
            },

            calculations: {
              entry: "executeCalculations",
              always: "event_creation"
            },

            event_creation: {
              entry: "executeEventCreation",
              always: "event_check"
            },

            event_check: {
              always: [
                {
                  guard: { type: "has_phase", params: { phase: "event" } },
                  target: "event"
                },
                { target: "news_check" }
              ]
            },
            event: {
              entry: "executeAutoResolveEvents",

              always: {
                guard: ({ context }) => allEventsResolved(context),
                target: "news_check"
              },
              on: {
                RESOLVE_EVENT: {
                  actions: {
                    type: "executeResolveEvent",
                    params: ({ event }) => event.payload
                  }
                },
                ADVANCE: {
                  // Defense in depth — UI also disables the advance
                  // button via the `advanceEnabled` snapshot selector.
                  guard: ({ context }) => allEventsResolved(context),
                  target: "news_check"
                }
              }
            },

            news_check: {
              always: [
                {
                  guard: { type: "has_phase", params: { phase: "news" } },
                  target: "news"
                },
                { target: "mailbox_check" }
              ]
            },
            news: {
              on: { ADVANCE: "mailbox_check" }
            },

            mailbox_check: {
              always: [
                {
                  guard: {
                    type: "has_phase",
                    params: { phase: "action" }
                  },
                  target: "mailbox"
                },
                { target: "start_of_season_check" }
              ]
            },
            mailbox: {
              entry: "executeMailbox",
              always: "start_of_season_check"
            },

            start_of_season_check: {
              always: [
                {
                  guard: "is_start_of_season",
                  target: "start_of_season"
                },
                { target: "seed_check" }
              ]
            },
            start_of_season: {
              entry: "seasonStartSetup",
              always: "seed_check"
            },

            seed_check: {
              always: [
                {
                  guard: { type: "has_seeds" },
                  target: "seed"
                },
                { target: "gala_check" }
              ]
            },
            seed: {
              entry: "executeSeedPhase",
              always: { target: "gala_check" }
            },

            gala_check: {
              always: [
                {
                  guard: { type: "has_phase", params: { phase: "gala" } },
                  target: "gala"
                },
                { target: "end_of_season_check" }
              ]
            },
            gala: {
              entry: "executeGalaPhase",
              on: { ADVANCE: "end_of_season_check" }
            },

            end_of_season_check: {
              always: [
                {
                  guard: "is_end_of_season",
                  target: "end_of_season"
                },
                { target: "round_end" }
              ]
            },
            end_of_season: {
              initial: "world_championships",
              states: {
                world_championships: {
                  entry: "executeWorldChampionships",
                  on: { ADVANCE: "finalize_stats" }
                },
                finalize_stats: {
                  entry: "executeFinalizeSeasonStats",
                  always: "review"
                },
                review: {
                  on: { ADVANCE: "committing" }
                },
                committing: {
                  entry: "executeSeasonEnd",
                  always: "#round_end_after_season"
                }
              }
            },

            round_end: {
              id: "round_end_after_season",
              // Defensive cleanup. Resolved events normally get cleared
              // when exiting the `news` phase, but not every round has
              // one — so wipe any leftovers at the round boundary.
              entry: ["executeClearEvents", "advanceRound"],
              always: [
                { guard: "calendar_in_bounds", target: "action_check" },
                { target: "season_done" }
              ]
            },

            // Parking state for "ran off the calendar". Real season-boundary
            // logic (reset round, bump season) lands when end_of_season is
            // migrated.
            season_done: {}
          }
        }
      }
    }
  }
});
