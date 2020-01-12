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
import {
  CompetitionService,
  TournamentCompetitionPhase,
  Team,
  Manager,
  Managers,
  Invitation,
  TournamentCompetitionGroup
} from "../../types/base";
import { MHMState } from "../../ducks";
import { prop, difference, append } from "ramda";

const tournaments: CompetitionService = {
  relegateTo: false,
  promoteTo: false,

  start: function*() {
    yield call(setCompetitionTeams, "tournaments", List());
  },

  groupEnd: function*(phase, group) {
    const tournament: TournamentCompetitionGroup = yield select(
      (state: MHMState) =>
        state.game.competitions.tournaments.phases[phase].groups[group]
    );

    const managers: Managers = yield select(
      (state: MHMState) => state.manager.managers
    );
    const teams: Team[] = yield select((state: MHMState) => state.game.teams);

    for (const stat of tournament.stats) {
      const team = teams[stat.id];

      if (team.domestic) {
        yield call(incrementReadiness, team.id, -2);

        if (team.manager !== undefined) {
          const award = tournamentList[group].award;
          const manager = managers[team.manager];

          yield all([
            call(
              addAnnouncement,
              manager.id,
              `Tilillenne on siirretty __${a(
                award
              )}__ pekkaa rahaa. Viiteviesti: joulutauon turnaus, osallistumismaksu, _${
                tournament.name
              }_.`
            ),
            call(incrementBalance, manager.id, award)
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

  parameters: {
    gameday: phase => ({
      advantage: {
        home: team => 0,
        away: team => 0
      },
      base: () => 20,
      moraleEffect: team => {
        return team.morale * 2;
      }
    })
  },

  seed: [
    function*(competitions) {
      const teams: Team[] = yield select(foreignTeams);

      const managers: Managers = yield select(
        (state: MHMState) => state.manager.managers
      );

      const invitations: Invitation[] = yield select((state: MHMState) =>
        state.invitation.invitations.filter(i => i.participate === true)
      );

      const invited: [number, number][] = invitations.map(i => [
        i.tournament,
        managers[i.manager].team
      ]);

      const reduced: {
        alreadyInvited: number[];
        groups: TournamentCompetitionGroup[];
      } = {
        alreadyInvited: [],
        groups: []
      };

      const ret = tournamentList.reduce((re, tournament, tournamentIndex) => {
        const invitedTeams = invited.filter(i => i[0] === tournamentIndex);

        const assignables = difference(
          teams.filter(tournament.filter).map(prop("id")),
          re.alreadyInvited
        );

        const sampled = r.sample(assignables, 6 - invitedTeams.length);

        const participants = [...invitedTeams.map(i => i[1]), ...sampled];

        const group: TournamentCompetitionGroup = {
          type: "tournament",
          penalties: [],
          colors: ["d", "l", "l", "l", "l", "l"],
          teams: participants,
          round: 0,
          name: tournament.name,
          schedule: tournamentScheduler(participants.length),
          stats: []
        };

        return {
          alreadyInvited: [...re.alreadyInvited, ...sampled],
          groups: append(group, re.groups)
        };
      }, reduced);

      const teamz = ret.groups.map(g => g.teams).flat();

      yield call(setCompetitionTeams, "tournaments", teamz);

      return {
        name: "jouluturnaukset",
        type: "tournament",
        teams: teamz,
        groups: ret.groups
      } as TournamentCompetitionPhase;
    }
  ]
};
