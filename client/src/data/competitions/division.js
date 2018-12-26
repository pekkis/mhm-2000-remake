import { Map, List } from "immutable";
import rr from "../../services/round-robin";

/*
{
  phl: Map({
    id: "phl",
    phase: 0,
    name: "PHL",
    teams: List.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11),
    phases: List.of(
      Map({
        round: 0,
        name: "runkosarja",
        type: "round-robin",
        teams: 12,
        times: 2,
        schedule: List()
      })
    )
  }),
  division: Map({
    id: "division",
    phase: 0,
    name: "Divisioona",
    teams: List.of(12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23),
    phases: List.of(
      Map({
        round: 0,
        name: "runkosarja",
        type: "round-robin",
        teams: 12,
        times: 2,
        schedule: List()
      })
    )
  })
}
*/

export default Map({
  relegateTo: false,
  promoteTo: "phl",

  gamedays: List.of(5, 10, 15),

  gameBalance: (facts, player) => {
    if (facts.isLoss) {
      return player.get("extra");
    }

    if (facts.isDraw) {
      return (
        3000 + 2000 * player.getIn(["arena", "level"]) + player.get("extra")
      );
    }

    return (
      10000 + 3000 * player.getIn(["arena", "level"]) + player.get("extra")
    );
  },

  parameters: Map({
    gameday: {
      advantage: Map({
        home: strength => strength + 5,
        away: strength => strength - 5
      }),
      base: () => 10
    }
  }),

  seed: List.of(competition => {
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
  })

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
