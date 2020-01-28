import rr from "../../round-robin";
import playoffScheduler, { victors } from "../../playoffs";
import { defaultMoraleBoost } from "../../morale";
import r from "../../random";
import {
  CompetitionService,
  RoundRobinCompetitionGroup,
  RoundRobinCompetitionPhase,
  Matchups,
  PlayoffsCompetitionPhase,
  PlayoffsCompetitionGroup
} from "../../../types/base";
import { sortBy, range, map, take, prop, takeLast } from "ramda";
import { sortLeagueTable } from "../../league";

const mutasarja: CompetitionService = {
  homeAdvantage: (phase, group) => {
    return 1;
  },

  awayAdvantage: (phase, group) => {
    return 0.85;
  },

  relegateTo: false,
  promoteTo: "division",

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

  readinessBoost: (phase, facts, manager) => {
    return 0;
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
      const competition = competitions.mutasarja;
      const teams = sortBy(() => r.real(1, 1000), competition.teams);
      const times = 2;

      const groups = map(r => {
        const groupTeams = teams.slice(r * 12, r * 12 + 12);
        const group: RoundRobinCompetitionGroup = {
          id: r,
          penalties: [],
          type: "round-robin",
          times,
          stats: [],
          round: 0,
          name: "runkosarja",
          teams: groupTeams,
          schedule: rr(groupTeams.length, times),
          colors: ["d", "d", "d", "d", "d", "d", "l", "l", "l", "l", "l", "l"]
        };
        return group;
      }, range(0, 2));

      const phase: RoundRobinCompetitionPhase = {
        id: 0,
        teams: teams,
        name: "runkosarja",
        type: "round-robin",
        groups
      };

      return phase;
    },
    competitions => {
      const teams = map(
        prop("id"),
        sortLeagueTable([
          ...take(
            6,
            (competitions.mutasarja.phases[0]
              .groups[0] as RoundRobinCompetitionGroup).stats
          ),
          ...take(
            6,
            (competitions.mutasarja.phases[0]
              .groups[1] as RoundRobinCompetitionGroup).stats
          )
        ])
      );

      const matchups: Matchups = [
        [0, 11],
        [1, 10],
        [2, 9],
        [3, 8],
        [4, 7],
        [5, 6]
      ];

      const winsToAdvance = 3;

      return {
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
            schedule: playoffScheduler(matchups, winsToAdvance)
          }
        ]
      };
    },
    competitions => {
      const teams = [
        ...takeLast(
          1,
          map(
            prop("id"),
            (competitions.division.phases[0] as RoundRobinCompetitionPhase)
              .groups[0].stats
          )
        ),
        ...map(
          prop("id"),
          victors(
            (competitions.mutasarja.phases[1] as PlayoffsCompetitionPhase)
              .groups[0]
          )
        )
      ];

      const matchups: Matchups = [
        [0, 7],
        [1, 6],
        [2, 5],
        [3, 4]
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
          (competitions.mutasarja.phases[2] as PlayoffsCompetitionPhase)
            .groups[0]
        )
      );

      const matchups: Matchups = [
        [0, 3],
        [1, 2]
      ];

      const winsToAdvance = 3;

      const phase: PlayoffsCompetitionPhase = {
        id: 3,
        name: "finaalit",
        type: "playoffs",
        teams,
        groups: [
          {
            name: "Finaalit",
            id: 0,
            type: "playoffs",
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

export default mutasarja;
