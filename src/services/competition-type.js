import { Map } from "immutable";
import { matchups } from "../services/playoffs";
import table from "../services/league";

const competitionTypes = Map({
  "round-robin": Map({
    playMatch: () => true,
    overtime: () => false,
    stats: group => {
      return table(group);
    }
  }),
  tournament: Map({
    playMatch: () => true,
    overtime: () => false,
    stats: group => {
      return table(group);
    }
  }),
  playoffs: Map({
    stats: group => {
      return matchups(group);
    },
    playMatch: (phase, round, matchup) => {
      const situation = phase.get("stats");
      const match = situation.get(matchup);

      if (match.getIn(["home", "wins"]) === phase.get("winsToAdvance")) {
        console.log("HOME TEAM HAS ENUFF WINS");
        return false;
      }

      if (match.getIn(["away", "wins"]) === phase.get("winsToAdvance")) {
        console.log("AWAY TEAM HAS ENUFF WINS");
        return false;
      }

      return true;
    },
    overtime: result => {
      return result.get("home") === result.get("away");
    }
  })
});

export default competitionTypes;
