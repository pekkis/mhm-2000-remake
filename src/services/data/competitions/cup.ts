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
  CupCompetitionPhase
} from "../../../types/base";

import cupScheduler from "../../../services/cup";
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

  moraleBoost: (phase, facts, manager) => {
    return defaultMoraleBoost(facts);
  },

  readinessBoost: (phase, facts, manager) => {
    return 0;
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
      const phase: CupCompetitionPhase = {
        name: "cup",
        type: "cup",
        teams,
        groups: [
          {
            penalties: [],
            type: "cup",
            round: 0,
            name: "1. kierros",
            teams,
            schedule: cupScheduler(teams.length),
            stats: []
          }
        ]
      };
      return phase;
    },
    competitions => {
      const teams = take(
        8,
        map(
          prop("id"),
          (competitions.phl.phases[0].groups[0] as RoundRobinCompetitionGroup)
            .stats
        )
      );

      const winsToAdvance = 3;
      const matchups: Matchups = [
        [0, 7],
        [1, 6],
        [2, 5],
        [3, 4]
      ];

      const phase: PlayoffsCompetitionPhase = {
        name: "quarterfinals",
        type: "playoffs",
        teams,
        groups: [
          {
            type: "playoffs",
            name: "playoffs",
            round: 0,
            teams,
            winsToAdvance,
            matchups,
            schedule: playoffScheduler(matchups, 3),
            stats: []
          }
        ]
      };
      return phase;
    },
    competitions => {
      const teams = map(
        prop("id"),
        victors(
          competitions.phl.phases[1].groups[0] as PlayoffsCompetitionGroup
        )
      );

      const matchups: Matchups = [
        [0, 3],
        [1, 2]
      ];

      const winsToAdvance = 3;

      return {
        name: "semifinals",
        type: "playoffs",
        teams,
        groups: [
          {
            type: "playoffs",
            round: 0,
            teams,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance)
          }
        ]
      } as PlayoffsCompetitionPhase;
    },
    competitions => {
      const teams = map(prop("id"), [
        ...victors(
          competitions.phl.phases[2].groups[0] as PlayoffsCompetitionGroup
        ),
        ...eliminated(
          competitions.phl.phases[2].groups[0] as PlayoffsCompetitionGroup
        )
      ]);

      const matchups: Matchups = [
        [0, 1],
        [2, 3]
      ];

      const winsToAdvance = 4;

      return {
        name: "finals",
        type: "playoffs",
        teams,
        groups: [
          {
            type: "playoffs",
            teams,
            round: 0,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance)
          }
        ]
      } as PlayoffsCompetitionPhase;
    }
  ]
};

export default cup;
