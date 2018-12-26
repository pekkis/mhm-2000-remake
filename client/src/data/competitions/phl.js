import { Map, List } from "immutable";
import rr from "../../services/round-robin";

export default Map({
  gamedays: List.of(5, 10, 15),

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
