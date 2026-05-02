import { matchups } from "@/services/playoffs";
import { cupMatchups } from "@/services/cup";
import table from "@/services/league";
import type {
  CupGroup,
  GameResult,
  Group,
  MatchupStat,
  PlayoffGroup
} from "@/types/competitions";

type GroupOfType<T extends Group["type"]> = Extract<Group, { type: T }>;

/**
 * `overtime` receives the full `(group, round, matchupIdx)` triple in
 * addition to the freshly-simulated `result`, so per-matchup history
 * (e.g. cup leg-1 aggregate) is reachable. Most competitions ignore
 * the extras.
 */
type CompetitionType<T extends Group["type"]> = {
  playMatch: (phase: Group, round: number, matchup: number) => boolean;
  overtime: (
    result: GameResult,
    group: Group,
    round: number,
    matchup: number
  ) => boolean;
  stats: (group: GroupOfType<T>) => GroupOfType<T>["stats"];
};

const competitionTypes: { [K in Group["type"]]: CompetitionType<K> } = {
  "round-robin": {
    playMatch: () => true,
    overtime: () => false,
    stats: (group) => table(group)
  },
  tournament: {
    playMatch: () => true,
    overtime: () => false,
    stats: (group) => table(group)
  },
  playoffs: {
    stats: (group) => matchups(group),
    playMatch: (phase, _round, matchup) => {
      const p = phase as PlayoffGroup;
      const match = p.stats[matchup] as MatchupStat;

      if (match.home.wins === p.winsToAdvance) {
        return false;
      }

      if (match.away.wins === p.winsToAdvance) {
        return false;
      }

      return true;
    },
    overtime: (result) => result.home === result.away
  },
  "independent-games": {
    playMatch: () => true,
    overtime: () => false,
    stats: () => []
  },
  cup: {
    playMatch: () => true,
    /**
     * Sudden-death overtime in leg 2 only, and only if the
     * aggregate would otherwise be tied. Leg 1 (round 0) never
     * triggers overtime; ties there are normal and resolved across
     * the two legs.
     */
    overtime: (result, group, round, matchupIdx) => {
      if (round === 0) return false;
      const cup = group as CupGroup;
      const leg1 = cup.schedule[0]?.[matchupIdx]?.result;
      if (!leg1) return false;
      // Leg 1: home = matchup[0]. Leg 2: home = matchup[1].
      // Aggregate per matchup-team:
      //   teamA = leg1.home + leg2.away
      //   teamB = leg1.away + leg2.home
      const teamA = leg1.home + result.away;
      const teamB = leg1.away + result.home;
      return teamA === teamB;
    },
    stats: (group) => cupMatchups(group)
  }
};

/**
 * Dispatch by `group.type` and return the precise `stats` subtype.
 * Single internal cast confines the union-narrowing problem to one spot;
 * call sites get exact types.
 */
export const computeStats = <G extends Group>(group: G): G["stats"] => {
  const impl = competitionTypes[group.type] as CompetitionType<G["type"]>;
  return impl.stats(group as unknown as GroupOfType<G["type"]>);
};

export default competitionTypes;
