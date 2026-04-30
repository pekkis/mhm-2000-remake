import { matchups } from "@/services/playoffs";
import table from "@/services/league";
import type {
  GameResult,
  Group,
  MatchupStat,
  PlayoffGroup
} from "@/types/competitions";

type GroupOfType<T extends Group["type"]> = Extract<Group, { type: T }>;

type CompetitionType<T extends Group["type"]> = {
  playMatch: (phase: Group, round: number, matchup: number) => boolean;
  overtime: (result: GameResult) => boolean;
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
