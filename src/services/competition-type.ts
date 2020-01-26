import { matchups } from "./playoffs";
import table from "./league";
import {
  CompetitionTypes,
  ForEvery,
  MatchOvertimeType,
  RoundRobinCompetitionGroup,
  LeagueTable,
  TournamentCompetitionGroup,
  PlayoffsCompetitionGroup,
  PlayoffsStats,
  CompetitionGroup,
  CupCompetitionGroup,
  CupStats,
  PartialMatchResult
} from "../types/base";
import { cupStats } from "./cup";

interface CompetitionTypeService<G extends CompetitionGroup, S> {
  stats: (group: G) => S;
  overtime: (
    group: G,
    round: number,
    matchup: number,
    result: PartialMatchResult
  ) => MatchOvertimeType | false;
  playMatch: (group: G, round: number, matchup: number) => boolean;
}

const competitionTypeService: ForEvery<
  CompetitionTypes,
  CompetitionTypeService<any, any>
> = {
  training: {
    playMatch: () => true,
    stats: () => {
      return {};
    },
    overtime: () => false
  },
  cup: {
    playMatch: () => true,
    stats: g => {
      return cupStats(g);
    },
    overtime: (group, round, matchup, result) => {
      if (round === 0) {
        return false;
      }

      const firstMatch = group.schedule[0][matchup];
      if (!firstMatch.result) {
        throw new Error("Cup resolution fails");
      }

      const firstGoals = firstMatch.result.home + result.away;
      const secondGoals = firstMatch.result.away + result.home;

      if (firstGoals !== secondGoals) {
        return false;
      }

      return {
        type: "continuous"
      };
    }
  } as CompetitionTypeService<CupCompetitionGroup, CupStats>,

  "round-robin": {
    playMatch: () => true,
    overtime: (group, round, matchup, result) => {
      if (result.home !== result.away) {
        return false;
      }

      return { type: "5min" };
    },
    stats: (group: RoundRobinCompetitionGroup) => {
      return table(group);
    }
  } as CompetitionTypeService<RoundRobinCompetitionGroup, LeagueTable>,

  tournament: {
    playMatch: () => true,
    overtime: () => false,
    stats: group => {
      return table(group);
    }
  } as CompetitionTypeService<TournamentCompetitionGroup, LeagueTable>,

  playoffs: {
    stats: group => {
      return matchups(group);
    },
    playMatch: (phase, round, matchup) => {
      const match = phase.stats[matchup];

      if (match.home.wins >= phase.winsToAdvance) {
        console.log("HOME TEAM HAS ENUFF WINS");
        return false;
      }

      if (match.away.wins >= phase.winsToAdvance) {
        console.log("AWAY TEAM HAS ENUFF WINS");
        return false;
      }

      return true;
    },
    overtime: (group, round, matchup, result) => {
      if (result.home !== result.away) {
        return false;
      }
      return {
        type: "continuous"
      };
    }
  } as CompetitionTypeService<PlayoffsCompetitionGroup, PlayoffsStats>
};

export default competitionTypeService;
