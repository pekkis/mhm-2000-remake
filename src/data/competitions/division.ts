import { scheduler as roundRobinScheduler } from "@/services/round-robin";
import playoffScheduler, { victors } from "@/services/playoffs";
import { defaultMoraleBoost } from "@/services/morale";
import r from "@/services/random";
import type {
  Competition,
  CompetitionDefinition,
  PlayoffGroup,
  TeamStat
} from "@/types/competitions";

const division: CompetitionDefinition = {
  data: {
    abbr: "div",
    weight: 1000,
    id: "division",
    phase: -1,
    name: "Divisioona",
    teams: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    phases: []
  },

  relegateTo: "mutasarja",
  promoteTo: "phl",

  gameBalance: (_phase, facts, manager) => {
    const arenaLevel = manager.arena.level + 1;

    if (facts.isLoss) {
      return manager.extra;
    }

    if (facts.isDraw) {
      return 3000 + 2000 * arenaLevel + manager.extra;
    }

    return 10000 + 3000 * arenaLevel + manager.extra;
  },

  moraleBoost: (_phase, facts, _manager) => {
    return defaultMoraleBoost(facts);
  },

  readinessBoost: (_phase, _facts, _manager) => {
    return 0;
  },

  parameters: {
    gameday: (_phase) => ({
      advantage: {
        home: (_team) => 5,
        away: (_team) => -5
      },
      base: () => 10,
      moraleEffect: (team) => {
        return team.morale;
      }
    })
  },

  seed: [
    (competitions: Record<string, Competition>) => {
      const competition = competitions.division;
      const teams = competition.teams.toSorted(() => r.real(1, 1000) - 500);
      const times = 2;
      return {
        teams,
        name: "runkosarja",
        type: "round-robin" as const,
        times,
        groups: [
          {
            penalties: [],
            type: "round-robin" as const,
            round: 0,
            name: "runkosarja",
            teams,
            schedule: roundRobinScheduler(teams.length, times),
            stats: [],
            colors: ["d", "d", "d", "d", "d", "d", "l", "l", "l", "l", "l", "l"]
          }
        ]
      };
    },
    (competitions: Record<string, Competition>) => {
      const divStats = competitions.division.phases[0].groups[0]
        .stats as TeamStat[];
      const phlStats = competitions.phl.phases[0].groups[0].stats as TeamStat[];

      const teams = divStats
        .slice(0, 6)
        .map((e) => e.id)
        .concat(phlStats[phlStats.length - 1].id);

      const matchupList: [number, number][] = [
        [0, 5],
        [1, 4],
        [2, 3]
      ];

      const winsToAdvance = 3;

      return {
        name: "neljännesfinaalit",
        type: "playoffs" as const,
        teams,
        groups: [
          {
            type: "playoffs" as const,
            teams,
            round: 0,
            name: "quarterfinals",
            matchups: matchupList,
            winsToAdvance,
            schedule: playoffScheduler(matchupList, winsToAdvance),
            stats: []
          }
        ]
      };
    },
    (competitions: Record<string, Competition>) => {
      const phlStats = competitions.phl.phases[0].groups[0].stats as TeamStat[];
      const phlLast = phlStats[phlStats.length - 1].id;
      const prev = competitions.division.phases[1].groups[0] as PlayoffGroup;

      const teams = [phlLast, ...victors(prev).map((t) => t.id)];

      const matchupList: [number, number][] = [
        [0, 3],
        [1, 2]
      ];

      const winsToAdvance = 3;

      return {
        name: "semifinaalit",
        type: "playoffs" as const,
        teams,
        groups: [
          {
            type: "playoffs" as const,
            round: 0,
            name: "semifinals",
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
      const prev = competitions.division.phases[2].groups[0] as PlayoffGroup;
      const teams = victors(prev).map((t) => t.id);

      const matchupList: [number, number][] = [[0, 1]];

      const winsToAdvance = 4;

      return {
        name: "finaalit",
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
    }
  ]
};

export default division;
