import playoffScheduler, { victors, eliminated } from "../../playoffs";
import { defaultMoraleBoost } from "../../morale";
import r from "../../random";
import { sortBy, take, map, prop, pluck } from "ramda";
import { select } from "redux-saga/effects";
import {
  CompetitionService,
  Matchups,
  PlayoffsCompetitionPhase,
  PlayoffsCompetitionGroup,
  RoundRobinCompetitionGroup,
  CupCompetitionPhase,
  isCupCompetitionGroup
} from "../../../types/base";

import cupScheduler, { cupMatchups, cupWinners } from "../../../services/cup";
import { Team } from "../../../types/team";
import { domesticTeams } from "../../selectors";
import { setCompetitionTeams } from "../../../sagas/competition";

const cup: CompetitionService = {
  start: function*() {
    const teams: Team[] = yield select(domesticTeams);
    const teamIds = pluck("id", teams);
    yield setCompetitionTeams("cup", teamIds);
  },

  homeAdvantage: (phase, group) => {
    return 1;
  },

  awayAdvantage: (phase, group) => {
    return 0.85;
  },

  gameBalance: (phase, facts, manager) => {
    const arenaLevel = manager.arena.level + 1;
    if (facts.isLoss) {
      return manager.extra;
    }

    if (facts.isDraw) {
      return 5000 + 3000 * arenaLevel + manager.extra;
    }

    return 10000 + 3000 * arenaLevel + manager.extra;
  },

  moraleBoost: (phase, facts) => {
    return defaultMoraleBoost(facts);
  },

  relegateTo: false,
  promoteTo: false,

  parameters: {
    gameday: phase => ({
      advantage: {
        home: team => 10,
        away: team => -10
      },
      base: () => 20,
      moraleEffect: team => {
        return team.morale * 2;
      }
    })
  },

  seed: [
    competitions => {
      const competition = competitions.cup;
      const teams = sortBy(() => r.real(1, 1000), competition.teams);

      const matchups = cupMatchups(teams.length);

      const phase: CupCompetitionPhase = {
        id: 0,
        name: "cup",
        type: "cup",
        teams,
        groups: [
          {
            id: 0,
            penalties: [],
            type: "cup",
            round: 0,
            name: "1. kierros",
            matchups,
            teams,
            schedule: cupScheduler(matchups),
            stats: []
          }
        ]
      };
      return phase;
    },
    competitions => {
      const competition = competitions.cup;

      const group = competition.phases[0].groups[0];

      if (!isCupCompetitionGroup(group)) {
        throw new Error("Invalid competition group");
      }

      const teams = cupWinners(group);

      console.log("WINNERS", teams);
      if (teams.length !== group.teams.length / 2) {
        throw new Error("OH NOES");
      }

      const matchups = cupMatchups(teams.length);
      const phase: CupCompetitionPhase = {
        id: 1,
        name: "cup",
        type: "cup",
        teams,
        groups: [
          {
            id: 0,
            penalties: [],
            type: "cup",
            round: 0,
            name: "2. kierros",
            matchups,
            teams,
            schedule: cupScheduler(matchups),
            stats: []
          }
        ]
      };
      return phase;
    },
    competitions => {
      const competition = competitions.cup;

      const group = competition.phases[1].groups[0];

      if (!isCupCompetitionGroup(group)) {
        throw new Error("Invalid competition group");
      }

      const teams = cupWinners(group);
      const matchups = cupMatchups(teams.length);
      const phase: CupCompetitionPhase = {
        id: 2,
        name: "cup",
        type: "cup",
        teams,
        groups: [
          {
            id: 0,
            penalties: [],
            type: "cup",
            round: 0,
            name: "3. kierros",
            matchups,
            teams,
            schedule: cupScheduler(matchups),
            stats: []
          }
        ]
      };
      return phase;
    },
    competitions => {
      const competition = competitions.cup;

      const group = competition.phases[2].groups[0];

      if (!isCupCompetitionGroup(group)) {
        throw new Error("Invalid competition group");
      }

      const teams = cupWinners(group);
      const matchups = cupMatchups(teams.length);
      const phase: CupCompetitionPhase = {
        id: 3,
        name: "cup",
        type: "cup",
        teams,
        groups: [
          {
            id: 0,
            penalties: [],
            type: "cup",
            round: 0,
            name: "4. kierros",
            matchups,
            teams,
            schedule: cupScheduler(matchups),
            stats: []
          }
        ]
      };
      return phase;
    },
    competitions => {
      const competition = competitions.cup;

      const group = competition.phases[3].groups[0];

      if (!isCupCompetitionGroup(group)) {
        throw new Error("Invalid competition group");
      }

      const teams = cupWinners(group);
      const matchups = cupMatchups(teams.length);
      const phase: CupCompetitionPhase = {
        id: 4,
        name: "cup",
        type: "cup",
        teams,
        groups: [
          {
            id: 0,
            penalties: [],
            type: "cup",
            round: 0,
            name: "5. kierros",
            matchups,
            teams,
            schedule: cupScheduler(matchups),
            stats: []
          }
        ]
      };
      return phase;
    },
    competitions => {
      const competition = competitions.cup;

      const group = competition.phases[4].groups[0];

      if (!isCupCompetitionGroup(group)) {
        throw new Error("Invalid competition group");
      }

      const teams = cupWinners(group);
      const matchups = cupMatchups(teams.length);
      const phase: CupCompetitionPhase = {
        id: 5,
        name: "cup",
        type: "cup",
        teams,
        groups: [
          {
            id: 0,
            penalties: [],
            type: "cup",
            round: 0,
            name: "6. kierros",
            matchups,
            teams,
            schedule: cupScheduler(matchups),
            stats: []
          }
        ]
      };
      return phase;
    }
  ]
};

export default cup;
