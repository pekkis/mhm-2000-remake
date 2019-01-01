import { Map, List, Range } from "immutable";
import { select, putResolve } from "redux-saga/effects";
import rr from "../../services/round-robin";
import playoffScheduler, { victors } from "../../services/playoffs";
import tournamentScheduler from "../../services/tournament";

import table, { sortStats } from "../../services/league";
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
      const ehlGroups = competitions.getIn(["ehl", "phases", 0, "groups"]);
      const ehlTables = ehlGroups.map(table);

      const qualifiedVictors = ehlTables.map(table => table.first());

      const sortedSeconds = sortStats(ehlTables.flatMap(table => table.rest()));

      const qualifiedSecond = sortedSeconds.first();

      const teams = qualifiedVictors.push(qualifiedSecond).map(e => e.id);

      console.log("Qualified teams", teams);

      return Map({
        name: "lopputurnaus",
        type: "tournament",
        teams,
        groups: List.of(
          Map({
            type: "tournament",
            colors: List.of("d", "l", "l", "l", "l", "l"),
            teams,
            round: 0,
            name: "lopputurnaus",
            schedule: tournamentScheduler(teams.count())
          })
        )
      });
    }
  )
});
