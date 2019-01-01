import { matchups, victors } from "../services/playoffs";

const competitionTypes = {
  "round-robin": {
    playMatch: () => true,
    overtime: () => false
  },
  tournament: {
    playMatch: () => true,
    overtime: () => false
  },
  playoffs: {
    playMatch: (phase, round, matchup) => {
      const situation = matchups(phase);

      console.log("matchup", matchup);

      console.log(situation);

      const match = situation.get(matchup);

      const victore = victors(phase);

      console.log(victore.toJS(), "veni, vidi, vici");

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
