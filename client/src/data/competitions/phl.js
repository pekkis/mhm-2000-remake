import { Map, List, Range, Repeat } from "immutable";
import rr from "../../services/round-robin";
import table from "../../services/league";
import playoffScheduler, { victors, eliminated } from "../../services/playoffs";

export default Map({
  gamedays: Range(1, 62).toList(),

  gameBalance: (facts, player) => {
    if (facts.isLoss) {
      return player.get("extra");
    }

    if (facts.isDraw) {
      return (
        5000 + 3000 * player.getIn(["arena", "level"]) + player.get("extra")
      );
    }

    return (
      10000 + 3000 * player.getIn(["arena", "level"]) + player.get("extra")
    );
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
        schedule: rr(teams.count(), times),
        colors: List.of(
          "d",
          "d",
          "d",
          "d",
          "d",
          "d",
          "d",
          "d",
          "l",
          "l",
          "l",
          "d"
        )
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
    },
    competitions => {
      const teams = victors(competitions.getIn(["phl", "phases", 1])).map(
        t => t.id
      );

      const matchups = List.of(List.of(0, 3), List.of(1, 2));

      const winsToAdvance = 3;

      return Map({
        round: 0,
        name: "semifinals",
        type: "playoffs",
        teams,
        matchups,
        winsToAdvance,
        schedule: playoffScheduler(matchups, winsToAdvance)
      });
    },
    competitions => {
      const teams = victors(competitions.getIn(["phl", "phases", 2]))
        .map(t => t.id)
        .concat(
          eliminated(competitions.getIn(["phl", "phases", 2])).map(t => t.id)
        );

      console.log("teamssssss", teams.toJS());

      const matchups = List.of(List.of(0, 1), List.of(2, 3));

      const winsToAdvance = 4;

      return Map({
        round: 0,
        name: "semifinals",
        type: "playoffs",
        teams,
        matchups,
        winsToAdvance,
        schedule: playoffScheduler(matchups, winsToAdvance)
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
