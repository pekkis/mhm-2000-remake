import { Map, List, Range } from "immutable";
import { select, putResolve, call } from "redux-saga/effects";
import rr from "../../services/round-robin";
import tournamentScheduler from "../../services/tournament";

import table, { sortStats } from "../../services/league";
import r from "../../services/random";
import { defaultMoraleBoost } from "../../services/morale";

import { addAnnouncement } from "../../sagas/news";

/*
IF edus1 = u THEN x = eds1
IF edus2 = u THEN x = eds2
IF edus3 = u THEN x = eds3
IF seh(x) = 1 THEN PRINT "Hurraa!! Voitimme!": raha = raha + 2000000: lemesm = leh(x)
IF seh(x) = 2 THEN PRINT "Hiphei!! Sijoituimme toiseksi!": raha = raha + 1600000
IF seh(x) = 3 THEN PRINT "Sijoituimme kolmanneksi!": raha = raha + 1400000
IF seh(x) = 4 THEN PRINT "Sijoituimme nelj„nneksi...": raha = raha + 1200000
IF seh(x) = 5 THEN PRINT "Sijoituimme viidenneksi...voi tukka!": raha = raha + 1000000
IF seh(x) = 6 THEN PRINT "™RRR! J„imme jumboiksi!": raha = raha + 800000
PRINT
tre = tre - 2
COLOR 8, 0: INPUT "Return...", yucca$
perfon2:

FOR y = 1 TO 6
IF seh(elt(y)) = 1 THEN lemes = leh(elt(y))
FOR yy = 1 TO 6
IF elt(y) = eds1 AND edus1 <> u AND seh(elt(y)) = yy THEN v(edus1) = v(edus1) + (32 - seh(elt(y)) * 2)
IF elt(y) = eds2 AND edus2 <> u AND seh(elt(y)) = yy THEN v(edus2) = v(edus2) + (32 - seh(elt(y)) * 2)
IF elt(y) = eds3 AND edus3 <> u AND seh(elt(y)) = yy THEN v(edus3) = v(edus3) + (32 - seh(elt(y)) * 2)
*/

function* ehlAwards() {
  const finalTournament = yield select(state =>
    state.game.getIn(["competitions", "ehl", "phases", 1, "groups", 0])
  );

  const managers = yield select(state => state.manager.get("managers"));
  const teams = yield select(state => state.game.get("teams"));

  for (const [index, stat] of finalTournament.get("stats").entries()) {
    console.log("stat", stat.toJS());
    const team = teams.get(stat.get("id"));
    if (team.get("domestic", true)) {
      console.log("team", index, team.toJS());

      if (team.get("manager")) {
        const manager = managers.get(team.get("manager"));
        console.log("manager", manager.toJS());
      }
    }

    // const manager = managers.find(m => stat.get("id") === m.get("team"));
    // if (manager) {
    //   console.log("manager", index, manager.toJS());
  }

  yield call(addAnnouncement, 0, `Ripulikakka __haisee__.`);
}

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

  groupEnd: function*(phase, group) {
    if (phase === 1) {
      yield call(ehlAwards);
    }
  },

  gameBalance: (phase, facts, manager) => {
    const arenaLevel = manager.getIn(["arena", "level"]) + 1;
    return 100000 + 20000 * arenaLevel;
  },

  moraleBoost: (phase, facts, manager) => {
    if (phase > 0) {
      return 0;
    }

    return defaultMoraleBoost(facts);
  },

  parameters: Map({
    gameday: {
      advantage: Map({
        home: team => 10,
        away: team => -10
      }),
      base: () => 20,
      moraleEffect: team => {
        return team.get("morale") * 2;
      }
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
            type: "round-robin",
            round: 0,
            name: `lohko ${groupId + 1}`,
            teams: teamSlice,
            schedule: rr(teamSlice.count(), times),
            colors: List.of("d", "l", "l", "l"),
            penalties: List()
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

      const teams = qualifiedVictors
        .push(qualifiedSecond)
        .map(e => e.get("id"));

      console.log("Qualified teams", teams);

      return Map({
        name: "lopputurnaus",
        type: "tournament",
        teams,
        groups: List.of(
          Map({
            type: "tournament",
            penalties: List(),
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
