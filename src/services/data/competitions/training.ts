import { Map, List } from "immutable";
import { select, call, all, putResolve } from "redux-saga/effects";
import tournamentScheduler from "../../tournament";
import r from "../../random";
import { foreignTeams, allTeams } from "../../selectors";

import tournamentList from "../../../data/tournaments";
import { setCompetitionTeams } from "../../../sagas/competition";
import { incrementReadiness } from "../../../sagas/team";
import { addAnnouncement } from "../../../sagas/news";
import { incrementBalance } from "../../../sagas/manager";
import { amount as a } from "../../format";
import {
  CompetitionService,
  TournamentCompetitionPhase,
  Managers,
  Invitation,
  TournamentCompetitionGroup,
  TrainingCompetitionPhase
} from "../../../types/base";
import { MHMState, competition } from "../../../ducks";
import { prop, difference, append, pluck } from "ramda";
import { Team } from "../../../types/team";

const training: CompetitionService = {
  relegateTo: false,
  promoteTo: false,

  homeAdvantage: (phase, group) => {
    return 1;
  },

  awayAdvantage: (phase, group) => {
    return 0.95;
  },

  start: function*() {
    const teams: Team[] = yield select(allTeams);
    const teamIds = pluck("id", teams);
    yield setCompetitionTeams("training", teamIds);
  },

  groupEnd: function*(phase, group) {},

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
    competitions => {
      const phase: TrainingCompetitionPhase = {
        type: "training",
        name: "Harjoitusottelut",
        teams: competitions.training.teams,
        groups: [
          {
            name: "Hharjoitusottelut",
            round: 0,
            type: "training",
            teams: competitions.training.teams,
            penalties: [],
            stats: [],
            schedule: [[], [], [], [], [], []]
          }
        ]
      };

      return phase;
    }
  ]
};

export default training;
