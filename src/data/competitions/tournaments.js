import { Map, List, Range } from "immutable";
import { select, putResolve, call, all } from "redux-saga/effects";
import rr from "../../services/round-robin";
import tournamentScheduler from "../../services/tournament";
import table, { sortStats } from "../../services/league";
import r from "../../services/random";
import { defaultMoraleBoost } from "../../services/morale";
import { addAnnouncement } from "../../sagas/news";
import { amount as a } from "../../services/format";
import { incrementStrength, incrementReadiness } from "../../sagas/team";
import { incrementBalance } from "../../sagas/manager";
import { setSeasonStat } from "../../sagas/stats";
import { foreignTeams } from "../selectors";

import tournamentList from "../tournaments";

export default Map({
  data: Map({
    weight: 2000,
    id: "tournaments",
    phase: -1,
    name: "Joulutauon turnaukset",
    abbr: "tournaments",
    phases: List()
  }),

  relegateTo: false,
  promoteTo: false,

  groupEnd: function*(phase, group) {
    /*
    if (phase === 1) {
      yield call(ehlAwards);
    }
    */
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

    const invited = yield select(state =>
      state.invitation
        .get("invitations")
        .filter(i => i.get("participate"))
        .groupBy(i => i.get("tournament"))
    );

    console.log("INVITED", invited.toJS());

    const reducer = Map({
      teams: teams,
      groups: List(),
      invited
    });

    /*
    return Map({
      name: "jouluturnaukset",
      type: "tournament",
      teams: "???",
    });
    */

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

    // const ehlGroups = competitions.getIn(["ehl", "phases", 0, "groups"]);
    // const ehlTables = ehlGroups.map(table);

    // const qualifiedVictors = ehlTables.map(table => table.first());

    // const sortedSeconds = sortStats(ehlTables.flatMap(table => table.rest()));

    // const qualifiedSecond = sortedSeconds.first();

    // const teams = qualifiedVictors.push(qualifiedSecond).map(e => e.get("id"));

    // console.log("Qualified teams", teams);

    const lusso = Map({
      name: "jouluturnaukset",
      type: "tournament",
      teams: groups.reduce((re, g) => re.concat(g.get("teams")), List()),
      groups
    });

    console.log("lusso", lusso.toJS());

    return lusso;
  })
});
