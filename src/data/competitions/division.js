import { Map, List } from "immutable";
import rr from "../../services/round-robin";
import playoffScheduler, { victors } from "../../services/playoffs";
import table from "../../services/league";

export default Map({
  relegateTo: false,
  promoteTo: "phl",

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

  seed: List.of(
    competitions => {
      const competition = competitions.get("division");
      const teams = competition.get("teams");
      const times = 2;
      return Map({
        teams,
        name: "runkosarja",
        type: "round-robin",
        times,
        groups: List.of(
          Map({
            type: "round-robin",
            round: 0,
            name: "runkosarja",
            teams,
            schedule: rr(teams.count(), times),
            colors: List.of(
              "d",
              "d",
              "d",
              "d",
              "d",
              "d",
              "l",
              "l",
              "l",
              "l",
              "l",
              "l"
            )
          })
        )
      });
    },
    competitions => {
      const teams = competitions
        .getIn(["division", "phases", 0, "groups", 0, "stats"])
        .map(e => e.get("id"))
        .take(6)
        .concat(
          competitions
            .getIn(["phl", "phases", 0, "groups", 0, "stats"])
            .map(e => e.get("id"))
            .last()
        );

      const matchups = List.of(List.of(0, 5), List.of(1, 4), List.of(2, 3));

      const winsToAdvance = 3;

      return Map({
        name: "neljännesfinaalit",
        type: "playoffs",
        teams,
        groups: List.of(
          Map({
            type: "playoffs",
            teams,
            round: 0,
            name: "quarterfinals",
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance)
          })
        )
      });
    },
    competitions => {
      const teams = List.of(
        competitions
          .getIn(["phl", "phases", 0, "groups", 0, "stats"])
          .map(e => e.get("id"))
          .last()
      ).concat(
        victors(competitions.getIn(["division", "phases", 1, "groups", 0])).map(
          t => t.get("id")
        )
      );

      const matchups = List.of(List.of(0, 3), List.of(1, 2));

      const winsToAdvance = 3;

      return Map({
        name: "semifinaalit",
        type: "playoffs",
        teams,
        groups: List.of(
          Map({
            type: "playoffs",
            round: 0,
            name: "semifinals",
            teams,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance)
          })
        )
      });
    },
    competitions => {
      const teams = victors(
        competitions.getIn(["division", "phases", 2, "groups", 0])
      ).map(t => t.get("id"));

      const matchups = List.of(List.of(0, 1));

      const winsToAdvance = 4;

      return Map({
        name: "finaalit",
        type: "playoffs",
        teams,
        groups: List.of(
          Map({
            type: "playoffs",
            round: 0,
            teams,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance)
          })
        )
      });
    }
  )
});
