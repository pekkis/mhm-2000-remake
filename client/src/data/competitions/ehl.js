import { Map, List, Range } from "immutable";
import { select, putResolve } from "redux-saga/effects";
import rr from "../../services/round-robin";
import playoffScheduler, { victors } from "../../services/playoffs";
import table from "../../services/league";
import r from "../../services/random";

export default Map({
  relegateTo: false,
  promoteTo: false,

  start: function*() {
    const ehlTeams = yield select(state => state.game.get("ehlParticipants"));
    const foreignTeams = yield select(state =>
      state.game
        .get("teams")
        .slice(24)
        .map(t => t.get("id"))
    );

    const teams = ehlTeams.concat(foreignTeams).sortBy(() => r.real(1, 10000));

    yield putResolve({
      type: "COMPETITION_SET_TEAMS",
      payload: {
        competition: "ehl",
        teams
      }
    });
  },

  gameBalance: (facts, player) => {
    // TODO
    return 0;

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
        home: strength => strength + 10,
        away: strength => strength - 10
      }),
      base: () => 20
    }
  }),

  seed: List.of(
    competitions => {
      const times = 1;
      const ehl = competitions.get("ehl");

      const teams = ehl.get("teams");

      console.log(teams, "tiims");

      const groups = Range(0, 5)
        .map(groupId => {
          const teamSlice = teams.slice(groupId * 4, groupId * 4 + 4);
          return Map({
            round: 0,
            name: `lohko ${groupId + 1}`,
            teams: teamSlice,
            schedule: rr(teamSlice.count(), times),
            colors: List.of("d", "l", "l", "l")
          });
        })
        .toList();

      return Map({
        teams,
        name: "runkosarja",
        type: "round-robin",
        groups
      });
    },
    competitions => {
      const teams = table(
        competitions.getIn(["division", "phases", 0, "groups", 0])
      )
        .map(e => e.id)
        .take(6);

      const matchups = List.of(List.of(0, 5), List.of(1, 4), List.of(2, 3));

      const winsToAdvance = 3;

      return Map({
        name: "neljännesfinaalit",
        type: "playoffs",
        teams,
        groups: List.of(
          Map({
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
        table(competitions.getIn(["phl", "phases", 0, "groups", 0]))
          .map(e => e.id)
          .last()
      ).concat(
        victors(competitions.getIn(["division", "phases", 1, "groups", 0])).map(
          t => t.id
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
      ).map(t => t.id);

      const matchups = List.of(List.of(0, 1));

      const winsToAdvance = 4;

      return Map({
        name: "finaalit",
        type: "playoffs",
        teams,
        groups: List.of(
          Map({
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
