import { Map } from "immutable";
import rr from "../services/round-robin";

const competitions = Map({
  phl: Map({
    parameters: Map({
      gameday: {
        advantage: Map({
          home: strength => strength + 10,
          away: strength => strength - 10
        }),
        base: () => 20
      }
    }),
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
  }),
  division: Map({
    parameters: Map({
      gameday: {
        advantage: Map({
          home: strength => strength + 5,
          away: strength => strength - 5
        }),
        base: () => 10
      }
    }),
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
  })
});

export default competitions;
