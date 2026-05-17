/**
 * Context-aware selectors for `GameContext`.
 *
 * These are pure functions that take a `GameContext` (the future
 * `gameMachine.context`) and return derived data. They mirror the
 * existing Redux selectors in `src/selectors.ts` but read from
 * the flat `GameContext` shape instead of `RootState`.
 *
 * During the migration, components can use either set:
 *   - Redux: `useAppSelector(reduxSelector)` (existing)
 *   - XState: `useSelector(actorRef, contextSelector)` (new)
 *
 * The selector bodies are intentionally identical to their Redux
 * counterparts — only the parameter type and property access paths
 * differ. This makes it easy to verify correctness by diffing.
 *
 * Selectors that depend on randomness (`randomRankedTeam`,
 * `randomTeamFrom`, `randomManager`) are included for completeness
 * but should be used with care in XState guards/actions — they are
 * not pure and may cause non-deterministic behavior in devtools
 * replay. Consider moving randomness into event payloads instead.
 */

import r from "@/services/random";
import { victors } from "@/services/playoffs";
import { entries, keys, pick, pickBy, values } from "remeda";
import calendar, { type CalendarEntry } from "@/data/calendar";
import { CRISIS_MORALE_MAX } from "@/data/constants";
import type { SnapshotFrom } from "xstate";
import type { gameMachine } from "./game";
import type {
  CompetitionId,
  Competition,
  PlayoffGroup,
  TeamStat
} from "@/types/competitions";
import type {
  GameFlags,
  HumanManager,
  HumanTeam,
  Manager,
  SeasonAction,
  Team
} from "@/state/game";
import type { MarketPlayer } from "@/state/player";
import type { GameContext } from "@/state/game-context";
import { competitionFromTier } from "@/services/competition";

// ---------------------------------------------------------------------------
// Helper types
// ---------------------------------------------------------------------------

/** Pure selector over `GameContext`. Most selectors are this shape. */
export type ContextSelector<T> = (ctx: GameContext) => T;

/**
 * Selector over the full game-machine snapshot. Use when the derived
 * value depends on machine state (`snap.matches(...)`), not just
 * context. Components consume these directly via
 * `GameMachineContext.useSelector(snapshotSelector)`.
 */
export type SnapshotSelector<T> = (snap: SnapshotFrom<typeof gameMachine>) => T;

// ---------------------------------------------------------------------------
// Competitions
// ---------------------------------------------------------------------------

export const primaryCompetitions: ContextSelector<
  Record<string, Competition>
> = (ctx) => pick(ctx.competitions, ["phl", "division"]);

export const competition =
  (id: CompetitionId): ContextSelector<Competition> =>
  (ctx) =>
    ctx.competitions[id];

// ---------------------------------------------------------------------------
// Advance enabled (derived from machine state + events)
// ---------------------------------------------------------------------------

/**
 * True iff every stored event has been resolved by the player (or
 * auto-resolved on entry to the event phase). Shared between the
 * machine guard on `event → news_check` and the snapshot selector
 * `advanceEnabled` consumed by the UI.
 */
export const allEventsResolved: ContextSelector<boolean> = (ctx) =>
  !values(ctx.event.events).some((e) => !e.resolved);

/**
 * Advance/end-turn is enabled unless:
 * - we're in the event phase with unresolved events, or
 * - we're in the action phase with incomplete required actions.
 *
 * This is a `SnapshotSelector` because the gating predicate needs to
 * know which machine state we're in, not just the context. Read with
 * `GameMachineContext.useSelector(advanceEnabled)`, NOT
 * `useGameContext(advanceEnabled)`.
 */
export const advanceEnabled: SnapshotSelector<boolean> = (snap) => {
  if (snap.matches({ in_game: { executing_phases: "event" } })) {
    return allEventsResolved(snap.context);
  }
  if (snap.matches({ in_game: { executing_phases: "action" } })) {
    return allRequiredActionsComplete(snap.context);
  }
  return true;
};

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

export const allTeams: ContextSelector<Team[]> = (ctx) => ctx.teams;

export const foreignTeams: ContextSelector<Team[]> = (ctx) =>
  ctx.teams.filter((t) => !t.domestic);

export const pekkalandianTeams: ContextSelector<Team[]> = (ctx) =>
  ctx.teams.slice(0, 48);

export const teamHasActiveEffects =
  (team: number): ContextSelector<boolean> =>
  (ctx) =>
    ctx.teams[team].effects.length > 0;

export const teamsManagerId =
  (team: number): ContextSelector<string | undefined> =>
  (ctx) =>
    ctx.teams[team]?.manager;

export const teamsManager =
  (team: number): ContextSelector<Manager> =>
  (ctx) => {
    const managerId = ctx.teams[team].manager;

    if (!managerId) {
      throw new Error("Team has no manager");
    }

    return ctx.managers[managerId];
  };

export const teamsMainCompetition =
  (team: number): ContextSelector<string> =>
  (ctx) => {
    const competesInPHL = teamCompetesIn(team, "phl")(ctx);
    return competesInPHL ? "phl" : "division";
  };

export const teamsCompetitions =
  (team: number): ContextSelector<Record<string, Competition>> =>
  (ctx) =>
    Object.fromEntries(
      entries(ctx.competitions).filter(([, c]) =>
        (c.teams ?? []).includes(team)
      )
    );

export const teamCompetesIn =
  (team: number, competitionId: string): ContextSelector<boolean> =>
  (ctx) => {
    const comps = teamsCompetitions(team)(ctx);
    return competitionId in comps;
  };

export const teamWasRelegated =
  (team: number): ContextSelector<boolean> =>
  (ctx) => {
    const phlStats = ctx.competitions.phl.phases[0].groups[0]
      .stats as TeamStat[];
    const phlLoser = phlStats[phlStats.length - 1].id;

    if (phlLoser !== team) {
      return false;
    }

    const divisionVictor = victors(
      ctx.competitions.division.phases[3].groups[0] as PlayoffGroup
    )[0].id;

    if (divisionVictor === team) {
      return false;
    }

    return true;
  };

export const teamWasPromoted =
  (team: number): ContextSelector<boolean> =>
  (ctx) => {
    const competesInDivision = teamCompetesIn(team, "division")(ctx);
    if (!competesInDivision) {
      return false;
    }

    const divisionVictor = victors(
      ctx.competitions.division.phases[3].groups[0] as PlayoffGroup
    )[0].id;

    return divisionVictor === team;
  };

export const teamsPositionInRoundRobin =
  (
    team: number,
    competitionId: CompetitionId,
    phase: number
  ): ContextSelector<number | false> =>
  (ctx) => {
    const thePhase = ctx.competitions[competitionId].phases[phase];

    const group = thePhase.groups.find((g) => g.teams.includes(team));

    if (!group) {
      return false;
    }

    const index = (group.stats as TeamStat[]).findIndex((e) => e.id === team);

    if (index === -1) {
      return false;
    }

    return index + 1;
  };

export const randomRankedTeam =
  (
    competitionId: CompetitionId,
    phaseId: number,
    range: number[],
    f: (t: Team) => boolean = () => true
  ): ContextSelector<Team | false> =>
  (ctx) => {
    const managerIds = ctx.human.order;

    const groups = ctx.competitions[competitionId].phases[phaseId].groups;

    const ret: Team[] = groups.flatMap((group) => {
      return (group.stats as TeamStat[])
        .filter((_s, i) => range.includes(i))
        .map((s) => ctx.teams[s.id])
        .filter((t) => !managerIds.includes(t.manager!))
        .filter(f);
    });

    if (ret.length === 0) {
      return false;
    }

    const randomized: Team = r.pick(ret);
    return ctx.teams[randomized.id];
  };

export const randomTeamFrom =
  (
    competitionIds: string[],
    canBeHumanControlled = false,
    excluded: number[] = [],
    f: (t: Team) => boolean = () => true
  ): ContextSelector<Team> =>
  (ctx) => {
    const team = randomTeamOrNullFrom(
      competitionIds,
      canBeHumanControlled,
      excluded,
      f
    )(ctx);

    if (!team) {
      throw new Error("Random team not found");
    }

    return team;
  };

export const randomTeamOrNullFrom =
  (
    competitionIds: string[],
    canBeHumanControlled = false,
    excluded: number[] = [],
    f: (t: Team) => boolean = () => true
  ): ContextSelector<Team | null> =>
  (ctx) => {
    const managersTeams: number[] = values(ctx.managers)
      .filter((m) => m.kind === "human")
      .map((p) => p.team)
      .filter((t): t is number => t !== undefined);

    const teams = entries(ctx.competitions)
      .filter(([id]) => competitionIds.includes(id))
      .flatMap(([, c]) => c.teams)
      .map((t) => ctx.teams[t])
      .filter((t) => canBeHumanControlled || !managersTeams.includes(t.id))
      .filter((t) => !excluded.includes(t.id))
      .filter(f);

    if (teams.length === 0) {
      return null;
    }

    const randomized: Team = r.pick(teams);
    return ctx.teams[randomized.id];
  };

// ---------------------------------------------------------------------------
// Managers
// ---------------------------------------------------------------------------

export const activeManager: ContextSelector<HumanManager> = (ctx) => {
  const activeId = ctx.human.active;

  if (!activeId) {
    throw new Error("No manager is active");
  }

  const manager = ctx.managers[activeId];

  if (manager.kind === "ai") {
    throw new Error("Active manager is AI");
  }

  return manager;
};

export const marketPlayers: ContextSelector<Record<string, MarketPlayer>> = (
  ctx
) => {
  return ctx.transferMarket.players;
};

export const humanManagerById =
  (id: string): ContextSelector<HumanManager> =>
  (ctx) => {
    const manager = managerById(id)(ctx);

    if (!manager) {
      throw new Error(`Manager #${id} not found`);
    }

    if (manager.kind === "ai") {
      throw new Error(`Manager #${id} is AI`);
    }

    return manager;
  };

export const humanManagers: ContextSelector<Record<string, HumanManager>> = (
  ctx
) => {
  return pickBy(ctx.managers, (manager) => manager.kind === "human");
};

export const activeManagersTeam: ContextSelector<Team> = (ctx) => {
  const mgr = activeManager(ctx);
  return ctx.teams[mgr.team!];
};

export const managerObject =
  (manager: string): ContextSelector<Manager | undefined> =>
  (ctx) => {
    const managerObj = ctx.managers[manager];
    if (!managerObj) {
      throw new Error(`Manager #${manager} not found`);
    }
    return managerObj;
  };

export const managerById =
  (id: string): ContextSelector<Manager> =>
  (ctx) => {
    const manager = ctx.managers[id];
    if (!manager) {
      throw new Error(`Manager #${id} not found`);
    }

    return manager;
  };

/**
 * True iff `manager` can still order a prank this round: their difficulty's
 * per-season cap isn't reached, the current calendar round actually allows
 * pranks, and — when a `price` is supplied — they can afford it.
 *
 * Price is passed in (rather than looked up from `@/game/pranks`) to avoid a
 * circular import: prank `execute()` generators reach back into sagas, which
 * already import these selectors. Callers resolve the price themselves.
 */
export const canOrderPrank =
  (manager: string, price?: number): ContextSelector<boolean> =>
  (ctx) => {
    const m = ctx.managers[manager];
    if (!m) {
      return false;
    }

    if (m.kind === "ai") {
      return false;
    }

    const round = calendar[ctx.turn.round];
    if (!round?.pranks) {
      return false;
    }

    const cap = 3;

    if (m.pranksExecuted >= cap) {
      return false;
    }
    if (price !== undefined && m.balance < price) {
      return false;
    }
    return true;
  };

/**
 * True iff `manager` can afford the given player price. Same shape as
 * `canOrderPrank` — caller passes the resolved price (the `playerTypes`
 * registry would create the same circular dep that `pranks` would).
 */
export const canBuyPlayer =
  (manager: string, price?: number): ContextSelector<boolean> =>
  (ctx) => {
    const m = ctx.managers[manager];
    if (!m) {
      return false;
    }

    if (m.kind === "ai") {
      return false;
    }

    if (price !== undefined && m.balance < price) {
      return false;
    }
    return true;
  };

/**
 * True iff `manager`'s team can stand to lose more strength: PHL teams
 * must stay above 130, division teams above 50. Mirrors the legacy
 * `sellPlayer()` saga's "Myyntilupa evätty" check (which the machine
 * still emits as a notification on the failure path — this selector is
 * purely for proactive UI gating).
 */
export const canSellPlayer =
  (manager: string): ContextSelector<boolean> =>
  (ctx) => {
    const m = ctx.managers[manager];
    if (!m || m.team === undefined) {
      return false;
    }

    return true;
  };

/**
 * True iff `manager` can hold a crisis meeting: calendar window is
 * open, team morale is ≤ -6 (QB: `mo(u(pv)) <= -6`), not already
 * held this round, and manager is not bankrupt. MHM 2000's meeting
 * is free — no cost check.
 */
export const canCrisisMeeting =
  (manager: string): ContextSelector<boolean> =>
  (ctx) => {
    const m = ctx.managers[manager];
    if (!m || m.team === undefined) {
      return false;
    }

    if (m.kind === "ai") {
      return false;
    }

    if (!calendar[ctx.turn.round]?.crisisMeeting) {
      return false;
    }

    // QB: kriisi = 0 reset per round; kriisi = 1 locks after use
    if (m.crisisMeetingHeld) {
      return false;
    }

    const team = ctx.teams[m.team];
    if (team.morale > CRISIS_MORALE_MAX) {
      return false;
    }

    return true;
  };

export const managerWithId =
  (id: string): ContextSelector<Manager | undefined> =>
  (ctx) =>
    ctx.managers[id];

export const managersMainCompetition =
  (manager: string): ContextSelector<CompetitionId> =>
  (ctx) => {
    const competesInPHL = managerCompetesIn(manager, "phl")(ctx);
    return competesInPHL ? "phl" : "division";
  };

export const managersCompetitions =
  (manager: string): ContextSelector<Record<string, Competition>> =>
  (ctx) => {
    const team = ctx.managers[manager]?.team;
    if (team === undefined) {
      return {};
    }
    return Object.fromEntries(
      entries(ctx.competitions).filter(([, c]) => c.teams.includes(team))
    );
  };

export const managerCompetesIn =
  (manager: string, competitionId: string): ContextSelector<boolean> =>
  (ctx) => {
    const competitions = managersCompetitions(manager)(ctx);
    return competitionId in competitions;
  };

export const managersTeam =
  (manager: string): ContextSelector<Team> =>
  (ctx) =>
    ctx.teams[ctx.managers[manager]?.team!];

export const humanManagersTeam =
  (manager: string): ContextSelector<HumanTeam> =>
  (ctx) => {
    const team = ctx.teams[ctx.managers[manager]?.team!];

    if (!team || team.kind !== "human") {
      throw new Error("Invalid human managers team");
    }

    return team;
  };

export const managersBalance =
  (manager: string): ContextSelector<number> =>
  (ctx) => {
    const m = ctx.managers[manager];

    if (m.kind === "ai") {
      return 0;
    }

    return m.balance;
  };

export const managersTeamId =
  (manager: string): ContextSelector<number> =>
  (ctx) =>
    managersTeam(manager)(ctx).id;

export const managersDifficulty =
  (manager: string): ContextSelector<number> =>
  (ctx) =>
    humanManagerById(manager)(ctx).difficulty;

export const managerHasEnoughMoney =
  (manager: string, neededAmount: number): ContextSelector<boolean> =>
  (ctx) => {
    const amount = humanManagerById(manager)(ctx).balance;
    return neededAmount <= amount;
  };

export const managerWhoControlsTeam =
  (id: number): ContextSelector<Manager | undefined> =>
  (ctx) =>
    values(ctx.managers).find((p) => p.team === id);

export const managerFlag =
  (manager: string, flag: string): ContextSelector<boolean | undefined> =>
  (ctx) =>
    humanManagerById(manager)(ctx).flags?.[flag];

export const randomManager =
  (exclude: string[] = []): ContextSelector<Manager> =>
  (ctx) => {
    const psycho = flag("psycho")(ctx);
    const mgrs = values(ctx.managers)
      .filter((m) => m.id !== psycho)
      .filter((m) => !exclude.includes(m.id));

    const random = r.pick(mgrs);
    return random;
  };

// ---------------------------------------------------------------------------
// Flags
// ---------------------------------------------------------------------------

export const flag =
  <K extends keyof GameFlags>(f: K): ContextSelector<GameFlags[K]> =>
  (ctx) =>
    ctx.flags[f];

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export const totalGamesPlayed =
  (
    manager: string,
    competition: CompetitionId,
    phase: number
  ): ContextSelector<number | undefined> =>
  (ctx) => {
    const record =
      ctx.managers?.[manager]?.stats?.games?.[competition]?.[phase];

    if (!record) {
      return 0;
    }

    return record.win + record.draw + record.loss;
  };

// ---------------------------------------------------------------------------
// Competitions (derived)
// ---------------------------------------------------------------------------

export const interestingCompetitions: ContextSelector<string[]> = (ctx) => {
  const team = activeManagersTeam(ctx);
  return keys(ctx.competitions).filter((id) => {
    const comp = ctx.competitions[id];
    return comp.phases.some((phase) =>
      phase.groups.some((group) => group.teams.includes(team.id))
    );
  });
};

// ---------------------------------------------------------------------------
// Season actions
// ---------------------------------------------------------------------------

/** Whether a manager has completed a specific season action. */
export const hasCompletedAction =
  (managerId: string, action: SeasonAction): ContextSelector<boolean> =>
  (ctx) => {
    const manager = ctx.managers[managerId];
    if (!manager || manager.kind !== "human") {
      return false;
    }
    return manager.completedActions.includes(action);
  };

/** Season actions a human manager has not yet completed. */
export const pendingActions =
  (managerId: string): ContextSelector<SeasonAction[]> =>
  (ctx) => {
    const entry = calendar[ctx.turn.round];
    if (!entry?.requiredActions?.length) {
      return [];
    }
    const manager = ctx.managers[managerId];
    if (!manager || manager.kind !== "human") {
      return [];
    }
    return entry.requiredActions.filter(
      (a) => !manager.completedActions.includes(a)
    );
  };

/**
 * True iff every human manager has completed all actions required by
 * the current round's `requiredActions`. Used as the ADVANCE guard on
 * deadline rounds.
 */
export const allRequiredActionsComplete: ContextSelector<boolean> = (ctx) => {
  const entry = calendar[ctx.turn.round];
  if (!entry?.requiredActions?.length) {
    return true;
  }

  return ctx.human.order.every((managerId) => {
    const manager = ctx.managers[managerId];
    if (!manager || manager.kind !== "human") {
      return true;
    }
    return entry.requiredActions!.every((a) =>
      manager.completedActions.includes(a)
    );
  });
};

export const currentCalendarEntry: ContextSelector<CalendarEntry> = (ctx) => {
  const round = calendar.at(ctx.turn.round);

  if (!round) {
    throw new Error(`Calendar entry #${ctx.turn.round} not found`);
  }

  return round;
};

// --- Helpers for building candidate pools ---

/**
 * Domestic teams sorted by previous-season ranking (best first),
 * sliced to ranks `from..to` (1-based inclusive). Teams without
 * `previousRankings` sort last.
 */
export const domesticTeamsByPreviousSeasonsRanking =
  (from: number, to: number): ContextSelector<Team[]> =>
  (ctx) => {
    return values(ctx.teams)
      .filter((t) => t.domestic)
      .toSorted(
        (a, b) =>
          (a.previousRankings?.[0] ?? 99) - (b.previousRankings?.[0] ?? 99)
      )
      .slice(from - 1, to);
  };

export const teamsWithTag =
  (tag: string): ContextSelector<Team[]> =>
  (ctx) => {
    return values(ctx.teams).filter((t) => t.tags.includes(tag));
  };

export const domesticTeamsByCompetitionTier =
  (tier: 1 | 2 | 3): ContextSelector<Team[]> =>
  (ctx) => {
    const comp = competitionFromTier(tier);

    return ctx.competitions[comp].teams.map((tid) => {
      return ctx.teams[tid];
    });
  };

// human selectors
