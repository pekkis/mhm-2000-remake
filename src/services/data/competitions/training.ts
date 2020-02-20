import { pluck } from "ramda";
import { select } from "redux-saga/effects";
import { setCompetitionTeams } from "../../../sagas/competition";
import {
  CompetitionService,
  TrainingCompetitionPhase
} from "../../../types/base";
import { Team } from "../../../types/team";
import { allTeams } from "../../selectors";

const training: CompetitionService = {
  canChooseIntensity: () => false,
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
        id: 0,
        type: "training",
        name: "Harjoitusottelut",
        teams: competitions.training.teams,
        groups: [
          {
            id: 0,
            name: "Harjoitusottelut",
            round: 0,
            type: "training",
            teams: competitions.training.teams,
            penalties: [],
            stats: [],
            schedule: [[], [], [], []]
          }
        ]
      };

      return phase;
    }
  ]
};

export default training;
