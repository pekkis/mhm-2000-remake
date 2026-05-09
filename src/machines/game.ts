import { setup, assign, sendTo, enqueueActions, stopChild } from "xstate";
import { produce, type Draft } from "immer";

import type { GameContext } from "@/state";
import {
  managerCompetesIn,
  canImproveArena,
  canOrderPrank,
  canBuyPlayer,
  canSellPlayer,
  canCrisisMeeting,
  allEventsResolved,
  humanManagers
} from "@/machines/selectors";
import calendar from "@/data/calendar";
import competitionData from "@/data/competitions";
import tournamentList from "@/data/tournaments";
import { isInvitedToTournament } from "@/machines/tournament-eligibility";
import { computeStats } from "@/services/competition-type";
import strategies, {
  READINESS_TICK_TAG,
  initialReadinessFor,
  type StrategyId
} from "@/data/mhm2000/strategies";
import prankTypes from "@/game/pranks";
import arenas from "@/data/arenas";
import playerTypes from "@/data/transfer-market";
import random, { cinteger } from "@/services/random";
import {
  notificationsMachine,
  pushNotification
} from "@/machines/notifications";
import type { NotificationData } from "@/machines/notification";
import { betMachine } from "@/machines/bet";
import { championBetMachine } from "@/machines/championBet";
import { contractNegotiationMachine } from "@/machines/contractNegotiation";
import type { CompetitionId } from "@/types/competitions";
import { values, entries } from "remeda";
import { autoLineup, assignPlayerToLineup } from "@/services/lineup";
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
import eventsMap from "@/game/new-events/table";
import { runGala } from "@/machines/parts/gala";
import { runGameday } from "@/machines/parts/gameday";
import { runSeasonStart } from "@/machines/parts/season-start";
import { createUniqueId } from "@/services/id";

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
  | {
      type: "SELECT_STRATEGY";
      payload: { manager: string; strategy: StrategyId };
    }
  | {
      type: "PLACE_CHAMPION_BET";
      payload: {
        manager: string;
        team: number;
        amount: number;
        odds: number;
      };
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
      type: "IMPROVE_ARENA";
      payload: { manager: string };
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
      type: "CRISIS_MEETING";
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
      type: "ACCEPT_INVITATION";
      payload: { manager: string; id: string };
    }
  | {
      type: "BET_RESOLVED";
      betId: string;
      effects: EventEffect[];
    }
  | {
      type: "NEGOTIATE_MARKET_PLAYER";
      payload: { managerId: string; playerId: string };
    }
  | {
      type: "AUTO_LINEUP";
      payload: { manager: string };
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
    championBet: championBetMachine,
    contractNegotiation: contractNegotiationMachine
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
          for (const team of draft.teams) {
            team.effects = team.effects.filter((e) => e.duration > 0);
            team.opponentEffects = team.opponentEffects.filter(
              (e) => e.duration > 0
            );
          }
          draft.betting.parlayBets = [];
          draft.news.news = [];
          draft.news.announcements = {};
          draft.turn.round += 1;
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
        })
    ),

    /**
     * championship_betting — spawn a champion bet actor for the chosen
     * team and debit the stake. The bet sits in `placed` until
     * end-of-season sends it `RESOLVE { champion }`; on resolution it
     * emits `BET_RESOLVED { effects }` which the root handler
     * interprets.
     */
    placeChampionBet: assign(
      (
        { context, spawn },
        params: { manager: string; team: number; amount: number; odds: number }
      ) =>
        produce(context, (draft) => {
          const m = draft.managers[params.manager];

          if (m.kind === "ai") {
            return;
          }

          if (m) {
            m.balance -= params.amount;
          }
          draft.betting.championBets.push(
            spawn("championBet", {
              id: `champion-bet-${createUniqueId()}`,
              input: {
                manager: params.manager,
                team: params.team,
                amount: params.amount,
                odds: params.odds
              }
            })
          );
        })
    ),

    /**
     * invitations_create phase — walk every manager × tournament pair and
     * push an invitation for each one the manager is eligible for.
     * Replaces the previous season's invitation list wholesale (no
     * separate season-start clear needed). 1-1 port of the legacy
     * `createInvitations()` saga.
     *
     * No UI — runs on `entry` and the state auto-advances. Acceptance
     * happens later via the `/kutsut` route firing `ACCEPT_INVITATION`.
     */
    executeInvitationsCreate: assign(({ context }) =>
      produce(context, (draft) => {
        const fresh: typeof draft.invitation.invitations = [];
        for (const managerId of draft.human.order) {
          for (let t = 0; t < tournamentList.length; t++) {
            const { competitionId, maxRanking } = tournamentList[t].eligibility;
            if (
              isInvitedToTournament(
                context,
                competitionId,
                maxRanking,
                managerId
              )
            ) {
              fresh.push({
                id: createUniqueId(),
                manager: managerId,
                tournament: t,
                accepted: false
              });
            }
          }
        }
        draft.invitation.invitations = fresh;
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
          const ctxFn = def.seedContext?.[phase];
          const seederContext = ctxFn ? ctxFn(context) : undefined;
          const newPhase = def.seed[phase](draft.competitions, seederContext);
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
     * improve arena — debits the manager and bumps their arena level by
     * one (clamped 0..9). 1-1 port of the legacy `improveArena()` saga.
     * Notification delivered separately via the `notify` action; UI gating
     * (price affordable, level < 9) stays in `Arena.tsx`.
     */
    executeImproveArena: assign(({ context }, params: { manager: string }) =>
      produce(context, (draft) => {
        const m = draft.managers[params.manager];
        if (!m) {
          return;
        }

        if (m.kind === "ai") {
          return;
        }

        const nextLevel = m.arena.level + 1;
        const nextArena = arenas[nextLevel];
        if (!nextArena) {
          return;
        }
        m.balance -= nextArena.price;
        m.arena.level = Math.max(0, Math.min(9, nextLevel));
      })
    ),

    /**
     * Buy a player from the transfer market: debit the manager and bump
     * their team's strength by a randomized skill amount. 1-1 port of the
     * legacy `buyPlayer()` saga.
     *
     * Lives outside the on-handler's `actions` array because the random
     * roll has to happen once — the assign and the notify both reference
     * the same `skillGain`. `enqueueActions` lets us do both with built-in
     * primitives (no dev-mode warning).
     */
    executeBuyPlayer: enqueueActions(
      (
        { context, enqueue },
        params: { manager: string; playerType: number }
      ) => {
        const playerType = playerTypes[params.playerType];
        const skillGain = playerType.skill();
        enqueue.assign(
          produce(context, (draft) => {
            const m = draft.managers[params.manager];
            if (!m || m.team === undefined) {
              return;
            }

            if (m.kind === "ai") {
              return;
            }

            m.balance -= playerType.buy;
            // draft.teams[m.team].strength += skillGain;
          })
        );
        enqueue.sendTo(
          "notifications",
          pushNotification({
            manager: params.manager,
            message: `Ostamasi pelaaja tuo ${skillGain} lisää voimaa joukkueeseen!`,
            type: "info"
          })
        );
      }
    ),

    /**
     * Sell a player to the transfer market: credit the manager and drop
     * their team's strength by a randomized skill amount. 1-1 port of the
     * legacy `sellPlayer()` saga. The strength-floor check lives in the
     * `canSellPlayer` guard upstream; the failure-path notification is
     * emitted from the on-handler's else branch.
     */
    executeSellPlayer: enqueueActions(
      (
        { context, enqueue },
        params: { manager: string; playerType: number }
      ) => {
        const playerType = playerTypes[params.playerType];
        const skillLoss = playerType.skill();
        enqueue.assign(
          produce(context, (draft) => {
            const m = draft.managers[params.manager];
            if (!m || m.team === undefined) {
              return;
            }

            if (m.kind === "ai") {
              return;
            }

            m.balance += playerType.sell;
          })
        );
        enqueue.sendTo(
          "notifications",
          pushNotification({
            manager: params.manager,
            message: `Myymäsi pelaaja vie ${skillLoss} voimaa mukanaan!`,
            type: "info"
          })
        );
      }
    ),

    /**
     * Hold a crisis meeting: debit the manager (full price in PHL,
     * half in division), bump team morale by 4 + the manager's
     * difficulty `moraleBoost`, and notify with the actual gain.
     * Notification includes the rolled value so the message and the
     * state stay consistent — `enqueueActions` lets us share `gain`
     * between the assign and the sendTo.
     *
     * 1-1 port of `crisisMeeting()` in `src/sagas/manager.ts`. The
     * morale clamp uses the manager's per-difficulty min/max from
     * `difficultyLevels`.
     */
    executeCrisisMeeting: enqueueActions(
      ({ context, enqueue }, params: { manager: string }) => {
        console.log(context, enqueue, params);
        return;

        /*
        const m = context.managers[params.manager];
        if (!m || m.team === undefined) {
          return;
        }

        if (m.kind === "ai") {
          return;
        }

        const team = context.teams[m.team!];
        const cost = context.competitions.division.teams.includes(team.id)
          ? CRISIS_COST / 2
          : CRISIS_COST;
        const diff = difficultyLevels[m.difficulty];
        const moraleGain = 4;

        enqueue.assign(
          produce(context, (draft) => {
            const dm = draft.managers[params.manager];
            if (!dm || dm.team === undefined) {
              return;
            }

            if (dm.kind === "ai") {
              return;
            }

            dm.balance -= cost;
            const dt = draft.teams[dm.team];
            dt.morale = Math.min(
              diff.moraleMax,
              Math.max(diff.moraleMin, dt.morale + moraleGain)
            );
          })
        );

        enqueue.sendTo(
          "notifications",
          pushNotification({
            manager: params.manager,
            message: `Psykologi valaa yhdessä managerin kanssa uskoa pelaajien mieliin. Moraali paranee (+${moraleGain}), ja joukkue keskittyy tuleviin haasteisiin uudella innolla!`,
            type: "info"
          })
        );
        */
      }
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
          assignPlayerToLineup(team.lineup, params.target, params.playerId);
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
    executeCalculations: assign(({ context }) =>
      produce(context, (draft) => {
        // Per-team: strategy-driven readiness drift — ONLY on regular-
        // season runkosarja gamedays. QB: ILEX5.BAS:1574 sits inside
        // `CASE 1` of `SELECT CASE kiero(kr)`, so EHL/cup/playoff/
        // training/preseason rounds get NO drift. Calendar entries
        // mark eligible rounds with the `readiness-tick` tag.
        const roundTags = calendar[draft.turn.round]?.tags ?? [];
        if (roundTags.includes(READINESS_TICK_TAG)) {
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
          for (const e of team.opponentEffects) {
            e.duration -= 1;
          }
        }
      })
    ),

    /**
     * Event creation phase — for each manager, roll one event from
     * `eventsMap` (1-335). If the rolled event is registered in the
     * new declarative registry, build its payload via `create(ctx, …)`
     * and push it into `event.events`. If not yet ported, the roll
     * silently no-ops (the legacy generator-based path is gone).
     *
     * 1-1 port of the deleted `eventCreationPhase()` from
     * `src/sagas/phase/event-creation.ts`,
     * minus the `createRandomEvent` calendar gate — entry to this state
     * is already guarded by `has_phase("event_creation")`, so the gate
     * is redundant.
     *
     * No UI — runs on `entry` and the state auto-advances.
     */
    executeEventCreation: assign(({ context }) =>
      produce(context, (draft) => {
        for (const manager of values(humanManagers(draft))) {
          const eventNumber = cinteger(1, 335);
          const eventName = eventsMap[eventNumber];

          if (!eventName) {
            continue;
          }

          // `spawnEvent` no-ops if the event isn't registered yet
          // (most of `eventsMap` until porting completes).
          spawnEvent(draft, eventName, { manager: manager.id });
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
    has_phase: ({ context }, params: { phase: string }) =>
      calendar[context.turn.round]?.phases.includes(params.phase) ?? false,
    calendar_in_bounds: ({ context }) => context.turn.round < calendar.length,
    /**
     * True iff any group in any of the round's gamedays still has rounds
     * left in its schedule. By game-design invariant, this is only ever
     * true for tournaments — regular competitions exhaust their schedule
     * in the single round dedicated to them in the calendar.
     */
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
    IMPROVE_ARENA: {
      // Single source of truth for affordability + level cap — the same
      // selector backs the `disabled` prop on the Arena.tsx upgrade button.
      // Sends from anywhere else (dev menu, future bots, future tests) get
      // the same enforcement for free.
      guard: ({ context, event }) =>
        canImproveArena(event.payload.manager)(context),
      actions: [
        {
          type: "executeImproveArena",
          params: ({ event }) => event.payload
        },
        {
          type: "notify",
          params: ({ event }) => ({
            notification: {
              manager: event.payload.manager,
              message:
                "Työmiehet käyttävät vallankumoukselllisia kvanttityövälineitä, ja rakennusurakka valmistuu alta aikayksikön!",
              type: "info"
            }
          })
        }
      ]
    },
    BUY_PLAYER: {
      // UI button (TransferMarket.tsx) is already disabled when the
      // manager can't pay; this guard catches stray sends from elsewhere.
      guard: ({ context, event }) => {
        const playerType = playerTypes[event.payload.playerType];
        return canBuyPlayer(event.payload.manager, playerType.buy)(context);
      },
      actions: {
        type: "executeBuyPlayer",
        params: ({ event }) => event.payload
      }
    },
    SELL_PLAYER: [
      // Happy path: team can spare the strength.
      {
        guard: ({ context, event }) =>
          canSellPlayer(event.payload.manager)(context),
        actions: {
          type: "executeSellPlayer",
          params: ({ event }) => event.payload
        }
      },
      // Failure path: preserve the legacy "myyntilupa evätty" feedback
      // instead of silently swallowing the click.
      {
        actions: {
          type: "notify",
          params: ({ event }) => ({
            notification: {
              manager: event.payload.manager,
              message:
                "Johtokunnan mielestä pelaajien myynti ei ole ratkaisu tämänhetkisiin ongelmiimme. Myyntilupa evätty.",
              type: "error"
            }
          })
        }
      }
    ],
    TEAM_INCUR_PENALTY: {
      actions: {
        type: "executeIncurPenalty",
        params: ({ event }) => event.payload
      }
    },
    CRISIS_MEETING: {
      // UI button (CrisisActions.tsx) is already disabled when the
      // window is closed, morale too high, or balance too low — guard
      // catches stray sends from elsewhere.
      guard: ({ context, event }) =>
        canCrisisMeeting(event.payload.manager)(context),
      actions: {
        type: "executeCrisisMeeting",
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
              draft.championBets = draft.championBets.filter(
                (ref) => ref.id !== event.betId
              );
            })
        });
        enqueue(stopChild(event.betId));
      })
    },
    ACCEPT_INVITATION: {
      // The user accepted a tournament invitation from the /kutsut UI.
      // Flip the invitation's `accepted`, drop every other un-accepted
      // invitation for the same manager (accepting one cancels the
      // rest — "sihteerisi vastasi muihin kieltävästi"), add the
      // manager's team to the tournaments competition, and notify.
      // 1-1 port of the legacy `acceptInvitation()` saga.
      actions: enqueueActions(({ context, enqueue, event }) => {
        const { manager, id } = event.payload;
        const teamId = context.managers[manager]?.team;
        runInterpreter(context, enqueue, (draft, notify) => {
          const idx = draft.invitation.invitations.findIndex(
            (i) => i.manager === manager && i.id === id
          );
          if (idx === -1) {
            return;
          }
          draft.invitation.invitations[idx].accepted = true;
          draft.invitation.invitations = draft.invitation.invitations.filter(
            (i) => i.manager !== manager || i.accepted
          );
          if (teamId !== undefined) {
            draft.competitions.tournaments.teams.push(teamId);
          }
          notify({
            manager,
            message:
              "Hyväksyit turnauskutsun. Sihteerisi vastasi kaikkiin muihin potentiaalisiin turnauskutsuihin kieltävästi.",
            type: "info"
          });
        });
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
              initial: "browsing",
              onDone: "prank_check",
              states: {
                browsing: {
                  on: {
                    NEGOTIATE_MARKET_PLAYER: "negotiating",
                    ADVANCE: "done"
                  }
                },
                negotiating: {
                  invoke: {
                    src: "contractNegotiation",
                    id: "contractNegotiation",
                    systemId: "contractNegotiation",
                    input: ({ context, event }) => {
                      if (event.type !== "NEGOTIATE_MARKET_PLAYER") {
                        throw new Error("negotiating entered from wrong event");
                      }
                      const { managerId, playerId } = event.payload;
                      const manager = context.managers[managerId];
                      const player = context.transferMarket.players[playerId];
                      const team =
                        manager?.team !== undefined
                          ? context.teams[manager.team]
                          : undefined;
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
                        mode: "market" as const,
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

            prank_check: {
              always: [
                {
                  guard: { type: "has_phase", params: { phase: "prank" } },
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
                  guard: { type: "has_phase", params: { phase: "gameday" } },
                  target: "gameday"
                },
                { target: "calculations_check" }
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
              onDone: "calculations_check",
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

            calculations_check: {
              always: [
                {
                  guard: {
                    type: "has_phase",
                    params: { phase: "calculations" }
                  },
                  target: "calculations"
                },
                { target: "event_creation_check" }
              ]
            },
            calculations: {
              entry: "executeCalculations",
              always: "event_creation_check"
            },

            event_creation_check: {
              always: [
                {
                  guard: {
                    type: "has_phase",
                    params: { phase: "event_creation" }
                  },
                  target: "event_creation"
                },
                { target: "event_check" }
              ]
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
                { target: "invitations_create_check" }
              ]
            },
            news: {
              on: { ADVANCE: "invitations_create_check" }
            },

            invitations_create_check: {
              always: [
                {
                  guard: {
                    type: "has_phase",
                    params: { phase: "invitations_create" }
                  },
                  target: "invitations_create"
                },
                { target: "start_of_season_check" }
              ]
            },
            invitations_create: {
              entry: "executeInvitationsCreate",
              always: "start_of_season_check"
            },

            start_of_season_check: {
              always: [
                {
                  guard: {
                    type: "has_phase",
                    params: { phase: "start_of_season" }
                  },
                  target: "start_of_season"
                },
                { target: "seed_check" }
              ]
            },
            start_of_season: {
              initial: "setup",
              onDone: "seed_check",
              states: {
                setup: {
                  entry: "seasonStartSetup",
                  always: "confirm_budget"
                },
                confirm_budget: {
                  on: {
                    CONFIRM_BUDGET: {
                      actions: {
                        type: "executeConfirmBudget",
                        params: ({ event }) => event.payload
                      },
                      target: "select_strategy"
                    }
                  }
                },
                select_strategy: {
                  on: {
                    SELECT_STRATEGY: {
                      actions: [
                        {
                          type: "selectStrategy",
                          params: ({ event }) => event.payload
                        }
                      ],
                      target: "championship_betting"
                    }
                  }
                },
                championship_betting: {
                  on: {
                    PLACE_CHAMPION_BET: {
                      actions: [
                        {
                          type: "placeChampionBet",
                          params: ({ event }) => event.payload
                        },
                        {
                          type: "notify",
                          params: ({ event }) => ({
                            notification: {
                              manager: event.payload.manager,
                              message:
                                "Kiikutat mestarusveikkauskuponkisi S-kioskille. Olkoon onni myötä!",
                              type: "info"
                            }
                          })
                        }
                      ],
                      target: "done"
                    },
                    ADVANCE: "done"
                  }
                },
                done: { type: "final" }
              }
            },

            seed_check: {
              always: [
                {
                  guard: { type: "has_phase", params: { phase: "seed" } },
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
                  guard: {
                    type: "has_phase",
                    params: { phase: "end_of_season" }
                  },
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
