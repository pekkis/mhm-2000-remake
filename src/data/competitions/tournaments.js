import { Map, List } from "immutable";
import { select, call, all } from "redux-saga/effects";
import tournamentScheduler from "../../services/tournament";
import r from "../../services/random";
import { foreignTeams } from "../selectors";

import tournamentList from "../tournaments";
import { setCompetitionTeams } from "../../sagas/game";
import { incrementReadiness } from "../../sagas/team";
import { addAnnouncement } from "../../sagas/news";
import { incrementBalance } from "../../sagas/manager";
import { amount as a } from "../../services/format";

export default Map({
  data: Map({
    weight: 2000,
    id: "tournaments",
    phase: -1,
    name: "Joulutauon turnaukset",
    abbr: "tournaments",
    phases: List(),
    teams: List()
  }),

  relegateTo: false,
  promoteTo: false,

  start: function*() {
    yield call(setCompetitionTeams, "tournaments", List());
  },

  groupEnd: function*(phase, group) {
    const tournament = yield select(state =>
      state.game.getIn([
        "competitions",
        "tournaments",
        "phases",
        phase,
        "groups",
        group
      ])
    );

    const managers = yield select(state => state.manager.get("managers"));
    const teams = yield select(state => state.game.get("teams"));

    for (const [, stat] of tournament.get("stats").entries()) {
      const team = teams.get(stat.get("id"));

      if (team.get("domestic", true)) {
        yield call(incrementReadiness, team.get("id"), -1);

        if (team.get("manager") !== undefined) {
          const award = tournamentList.getIn([group, "award"]);
          const manager = managers.get(team.get("manager"));
          console.log("manager", manager.toJS());

          yield all([
            call(
              addAnnouncement,
              manager.get("id"),
              `Tilillenne on siirretty __${a(
                award
              )}__ pekkaa rahaa. Viiteviesti: joulutauon turnaus, osallistumismaksu, _${tournament.get(
                "name"
              )}_.`
            ),
            call(incrementBalance, manager.get("id"), award)
          ]);
        }
      }
    }
  },

  gameBalance: (phase, facts, manager) => {
    return 0;
  },

  moraleBoost: (phase, facts, manager) => {
    return 0;
  },

  readinessBoost: (phase, facts, manager) => {
    return 0;
  },

  parameters: Map({
    gameday: (phase, group) => ({
      advantage: Map({
        home: team => 0,
        away: team => 0
      }),
      base: () => 20,
      moraleEffect: team => {
        return team.get("morale") * 2;
      }
    })
  }),

  seed: List.of(function*(competitions) {
    const teams = yield select(foreignTeams);

    const managers = yield select(state => state.manager.get("managers"));

    const invitations = yield select(state =>
      state.invitation.get("invitations").filter(i => i.get("participate"))
    );

    const invited = invitations
      .map(i => {
        return i.set("team", managers.getIn([i.get("manager"), "team"]));
      })
      .groupBy(i => i.get("tournament"));

    console.log("INVITED", invited.toJS());

    const reducer = Map({
      teams: teams,
      groups: List(),
      invited
    });

    const ret = tournamentList.reduce((re, tournament, tournamentIndex) => {
      console.log("RE", re.toJS());

      const invitedTeams = re
        .get("invited")
        .get(tournamentIndex, List())
        .map(i => i.get("team"));

      const participants = invitedTeams.concat(
        re
          .get("teams")
          .filter(tournament.get("filter"))
          .sortBy(() => r.real(1, 1000))
          .take(6 - invitedTeams.count())
          .map(t => t.get("id"))
      );

      return re
        .update("groups", groups =>
          groups.push(
            Map({
              type: "tournament",
              penalties: List(),
              colors: List.of("d", "l", "l", "l", "l", "l"),
              teams: participants,
              round: 0,
              name: tournament.get("name"),
              schedule: tournamentScheduler(participants.count())
            })
          )
        )
        .update("teams", teams =>
          teams.filterNot(t => participants.contains(t.get("id")))
        );
    }, reducer);

    const groups = ret.get("groups");

    console.log("groups", groups.toJS());

    const teamz = groups.reduce((re, g) => re.concat(g.get("teams")), List());

    yield call(setCompetitionTeams, "tournaments", teamz);

    return Map({
      name: "jouluturnaukset",
      type: "tournament",
      teams: teamz,
      groups
    });
  })
});
