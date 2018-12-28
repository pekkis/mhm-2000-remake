import { Map, List, Range } from "immutable";
import rr from "../../services/round-robin";
import table from "../../services/league";
import playoffScheduler from "../../services/playoffs";

export default Map({
  gamedays: Range(1, 50).toList(),

  gameBalance: (facts, player) => {
    // raha = raha + 10000 + 3000 * hjalli + extra:
    return 0;
    // raha = raha + 3000 + 2000 * hjalli
  },

  relegateTo: "division",
  promoteTo: false,

  parameters: Map({
    gameday: {
      advantage: Map({
        home: strength => strength + 10,
        away: strength => strength - 10
      }),
      base: () => 20
    }
  }),

  seed: List.of(
    competitions => {
      const competition = competitions.get("phl");
      const teams = competition.get("teams");
      const times = 2;
      return Map({
        round: 0,
        name: "runkosarja",
        type: "round-robin",
        teams,
        times,
        schedule: rr(teams.count(), times)
      });
    },
    competitions => {
      const teams = table(competitions.getIn(["phl", "phases", 0]))
        .take(8)
        .map(e => e.id);

      const winsToAdvance = 3;
      const matchups = List.of(
        List.of(0, 7),
        List.of(1, 6),
        List.of(2, 5),
        List.of(3, 4)
      );

      return Map({
        round: 0,
        name: "quarterfinals",
        type: "playoffs",
        teams,
        winsToAdvance,
        matchups,
        schedule: playoffScheduler(matchups, 3)
      });
    }
  )

  /*
  hooks: Map({
    SEASON_START: competition => {
      const teams = competition.get("teams");
      return competition.updateIn(["phases", 0], phase => {
        return phase
          .set("teams", teams)
          .set("schedule", rr(teams.count(), phase.get("times")));
      });
    }
  })
  */
});
