import { map, prop, sortBy, take, takeLast } from "ramda";
import {
  CompetitionService,
  Matchups,
  PlayoffsCompetitionPhase,
  RoundRobinCompetitionGroup,
  RoundRobinCompetitionPhase
} from "../../../types/base";
import { defaultMoraleBoost } from "../../morale";
import playoffScheduler, { victors } from "../../playoffs";
import r from "../../random";
import rr from "../../round-robin";

const division: CompetitionService = {
  canChooseIntensity: () => true,

  homeAdvantage: (phase, group) => {
    return 1;
  },

  awayAdvantage: (phase, group) => {
    return 0.85;
  },

  relegateTo: "mutasarja",
  promoteTo: "phl",

  gameBalance: (phase, facts, manager) => {
    const arenaLevel = manager.arena.level + 1;

    if (facts.isLoss) {
      return manager.extra;
    }

    if (facts.isDraw) {
      return 3000 + 2000 * arenaLevel + manager.extra;
    }

    return 10000 + 3000 * arenaLevel + manager.extra;
  },

  moraleBoost: (phase, facts, manager) => {
    return defaultMoraleBoost(facts);
  },

  parameters: {
    gameday: phase => ({
      advantage: {
        home: team => 5,
        away: team => -5
      },
      base: () => 10,
      moraleEffect: team => {
        return team.morale;
      }
    })
  },

  seed: [
    competitions => {
      const competition = competitions.division;
      const teams = sortBy(() => r.real(1, 1000), competition.teams);
      const times = 2;
      return {
        id: 0,
        teams: teams,
        name: "runkosarja",
        type: "round-robin",
        times,
        groups: [
          {
            id: 0,
            penalties: [],
            times,
            type: "round-robin",
            round: 0,
            name: "runkosarja",
            teams,
            schedule: rr(teams.length, times),
            colors: [
              "d",
              "d",
              "d",
              "d",
              "d",
              "d",
              "l",
              "l",
              "l",
              "l",
              "d",
              "d"
            ],
            stats: []
          } as RoundRobinCompetitionGroup
        ]
      } as RoundRobinCompetitionPhase;
    },
    competitions => {
      const teams = take(
        6,
        map(
          prop("id"),
          (competitions.division.phases[0] as RoundRobinCompetitionPhase)
            .groups[0].stats
        )
      );

      const matchups: Matchups = [
        [0, 5],
        [1, 4],
        [2, 3]
      ];

      const winsToAdvance = 3;

      const phase: PlayoffsCompetitionPhase = {
        id: 1,
        name: "neljännesfinaalit",
        type: "playoffs",
        teams,
        groups: [
          {
            id: 0,
            type: "playoffs",
            teams,
            round: 0,
            name: "quarterfinals",
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance),
            stats: []
          }
        ]
      };
      return phase;
    },
    competitions => {
      const teams = [
        ...takeLast(
          1,
          map(
            prop("id"),
            (competitions.phl.phases[0] as RoundRobinCompetitionPhase).groups[0]
              .stats
          )
        ),
        ...map(
          prop("id"),
          victors(
            (competitions.division.phases[1] as PlayoffsCompetitionPhase)
              .groups[0]
          )
        )
      ];

      const matchups: Matchups = [
        [0, 3],
        [1, 2]
      ];

      const winsToAdvance = 3;

      const phase: PlayoffsCompetitionPhase = {
        id: 2,
        name: "semifinaalit",
        type: "playoffs",
        teams,
        groups: [
          {
            id: 0,
            type: "playoffs",
            round: 0,
            name: "semifinals",
            teams,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance),
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
          (competitions.division.phases[2] as PlayoffsCompetitionPhase)
            .groups[0]
        )
      );

      const matchups: Matchups = [[0, 1]];
      const winsToAdvance = 3;

      const phase: PlayoffsCompetitionPhase = {
        id: 3,
        name: "finaalit",
        type: "playoffs",
        teams,
        groups: [
          {
            id: 0,
            type: "playoffs",
            name: "Finaalit",
            round: 0,
            teams,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance),
            stats: []
          }
        ]
      };

      return phase;
    }
  ]
};

export default division;
