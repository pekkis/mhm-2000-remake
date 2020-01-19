import { matchups } from "./playoffs";
import table from "./league";
import {
  CompetitionTypes,
  ForEvery,
  MatchResult,
  RoundRobinCompetitionGroup,
  LeagueTable,
  TournamentCompetitionGroup,
  PlayoffsCompetitionGroup,
  PlayoffsStats,
  CompetitionGroup
} from "../types/base";

interface CompetitionTypeService<G extends CompetitionGroup, S> {
  stats: (group: G) => S;
  overtime: (result: MatchResult) => boolean;
  playMatch: (group: G, round: number, matchup: number) => boolean;
}

const competitionTypeService: ForEvery<
  CompetitionTypes,
  CompetitionTypeService<any, any>
> = {
  training: {
    playMatch: () => true,
    stats: () => {},
    overtime: () => false
  },

  "round-robin": {
    playMatch: () => true,
    overtime: () => false,
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
    overtime: result => {
      return result.home === result.away;
    }
  } as CompetitionTypeService<PlayoffsCompetitionGroup, PlayoffsStats>
};

export default competitionTypeService;
