import { scheduler as roundRobinScheduler } from "@/services/round-robin";
import playoffScheduler, { victors, eliminated } from "@/services/playoffs";
import { defaultMoraleBoost } from "@/services/morale";
import r from "@/services/random";
import type {
  Competition,
  CompetitionDefinition,
  PlayoffGroup,
  RoundRobinGroup
} from "@/types/competitions";

const phl: CompetitionDefinition = {
  data: {
    weight: 500,
    id: "phl",
    abbr: "phl",
    phase: -1,
    name: "PHL",
    teams: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    phases: []
  },

  homeAndAwayTeamAdvantages: (_phase) => {
    return {
      home: 1.0,
      away: 0.85
    };
  },

  gameBalance: (_phase, facts, manager) => {
    const arenaLevel = manager.arena.level + 1;
    if (facts.isLoss) {
      return manager.extra;
    }

    if (facts.isDraw) {
      return 5000 + 3000 * arenaLevel + manager.extra;
    }

    return 10000 + 3000 * arenaLevel + manager.extra;
  },

  moraleBoost: (_phase, facts, _manager) => {
    return defaultMoraleBoost(facts);
  },

  readinessBoost: (_phase, _facts, _manager) => {
    return 0;
  },

  relegateTo: "division",
  promoteTo: false,

  parameters: {
    gameday: (_phase) => ({
      advantage: {
        home: (_team) => 10,
        away: (_team) => -10
      },
      base: () => 20,
      moraleEffect: (team) => {
        return team.morale * 2;
      }
    })
  },

  seed: [
    (competitions: Record<string, Competition>) => {
      const competition = competitions.phl;
      const teams = competition.teams.toSorted(() => r.real(1, 1000) - 500);
      const times = 2;
      return {
        name: "runkosarja",
        type: "round-robin" as const,
        teams,
        groups: [
          {
            penalties: [],
            type: "round-robin" as const,
            round: 0,
            name: "runkosarja",
            teams,
            times,
            schedule: roundRobinScheduler(teams.length, times),
            stats: [],
            colors: ["d", "d", "d", "d", "d", "d", "d", "d", "l", "l", "l", "d"]
          }
        ]
      };
    },
    (competitions: Record<string, Competition>) => {
      const group = competitions.phl.phases[0].groups[0] as RoundRobinGroup;

      const stats = group.stats;
      const teams = stats.slice(0, 8).map((e) => e.id);

      const winsToAdvance = 3;
      const matchupList: [number, number][] = [
        [0, 7],
        [1, 6],
        [2, 5],
        [3, 4]
      ];

      return {
        name: "quarterfinals",
        type: "playoffs" as const,
        teams,
        groups: [
          {
            type: "playoffs" as const,
            round: 0,
            teams,
            winsToAdvance,
            matchups: matchupList,
            schedule: playoffScheduler(matchupList, 3),
            stats: []
          }
        ]
      };
    },
    (competitions: Record<string, Competition>) => {
      const prev = competitions.phl.phases[1].groups[0] as PlayoffGroup;
      const teams = victors(prev).map((t) => t.id);

      const matchupList: [number, number][] = [
        [0, 3],
        [1, 2]
      ];

      const winsToAdvance = 3;

      return {
        name: "semifinals",
        type: "playoffs" as const,
        teams,
        groups: [
          {
            type: "playoffs" as const,
            round: 0,
            teams,
            matchups: matchupList,
            winsToAdvance,
            schedule: playoffScheduler(matchupList, winsToAdvance),
            stats: []
          }
        ]
      };
    },
    (competitions: Record<string, Competition>) => {
      const prev = competitions.phl.phases[2].groups[0] as PlayoffGroup;
      const teams = victors(prev)
        .map((t) => t.id)
        .concat(eliminated(prev).map((t) => t.id));

      const matchupList: [number, number][] = [
        [0, 1],
        [2, 3]
      ];

      const winsToAdvance = 4;

      return {
        name: "finals",
        type: "playoffs" as const,
        teams,
        groups: [
          {
            type: "playoffs" as const,
            teams,
            round: 0,
            matchups: matchupList,
            winsToAdvance,
            schedule: playoffScheduler(matchupList, winsToAdvance),
            stats: []
          }
        ]
      };
    }
  ]
};

export default phl;
