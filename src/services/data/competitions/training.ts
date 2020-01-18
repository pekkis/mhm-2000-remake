import { Map, List } from "immutable";
import { select, call, all } from "redux-saga/effects";
import tournamentScheduler from "../../tournament";
import r from "../../random";
import { foreignTeams } from "../../../data/selectors";

import tournamentList from "../../../data/tournaments";
import { setCompetitionTeams } from "../../../sagas/game";
import { incrementReadiness } from "../../../sagas/team";
import { addAnnouncement } from "../../../sagas/news";
import { incrementBalance } from "../../../sagas/manager";
import { amount as a } from "../../format";
import {
  CompetitionService,
  TournamentCompetitionPhase,
  Managers,
  Invitation,
  TournamentCompetitionGroup
} from "../../../types/base";
import { MHMState } from "../../../ducks";
import { prop, difference, append } from "ramda";
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

  start: function*() {},

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
      return;
    }
  ]
};

export default training;
