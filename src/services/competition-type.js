import { matchups, victors } from "../services/playoffs";
import table from "../services/league";

const competitionTypes = {
  "round-robin": {
    playMatch: () => true,
    overtime: () => false,
    stats: group => {
      return table(group);
    }
  },
  tournament: {
    playMatch: () => true,
    overtime: () => false,
    stats: group => {
      return table(group);
    }
  },
  playoffs: {
    stats: group => {
      return matchups(group);
    },
    playMatch: (phase, round, matchup) => {
      const situation = matchups(phase);

      console.log("matchup", matchup);

      console.log(situation);

      const match = situation.get(matchup);

      if (match.home.wins === phase.get("winsToAdvance")) {
        console.log("HOME TEAM HAS ENUFF WINS");
        return false;
      }

      if (match.away.wins === phase.get("winsToAdvance")) {
        console.log("AWAY TEAM HAS ENUFF WINS");
        return false;
      }

      return true;
    },
    overtime: result => {
      return result.get("home") === result.get("away");
    }
  }
};

export default competitionTypes;
