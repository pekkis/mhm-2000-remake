import { scheduler as roundRobinScheduler } from "@/services/round-robin";
import playoffScheduler, { victors } from "@/services/playoffs";
import { defaultMoraleBoost } from "@/services/morale";
import { sortStats } from "@/services/league";
import r from "@/services/random";
import type {
  Competition,
  CompetitionDefinition,
  PlayoffGroup,
  TeamStat
} from "@/types/competitions";

/**
 * Mutasarja — Pekkalandian third-tier league. Sits below Divisioona.
 *
 * Phases:
 *  - 0: runkosarja. 24 teams split randomly into two RR groups of 12,
 *       times=2 (same volume as PHL/Divisioona).
 *  - 1: playoff round of 12. Six best teams from each runkosarja group
 *       advance. They are reseeded into a single 12-team bracket using
 *       runkosarja points (wins/draws ignored beyond what `sortStats`
 *       does); best plays worst (1v12, 2v11, …, 6v7). Best-of-3.
 *  - 2: playoff round of 8. The six round-of-12 winners are joined by
 *       the two worst Divisioona runkosarja teams, who enter as seeds
 *       1 and 2 (i.e. they get the easiest matchups). Best-of-3.
 *  - 3: playoff round of 4. Four winners, two matchups (best-vs-worst by
 *       seed entering phase 2). Best-of-7. The two winners of this round
 *       are promoted to Divisioona for the next season — there is no
 *       further final between them. The two losers play in Mutasarja
 *       next season (and if they were Divisioona teams entering phase 2,
 *       they are effectively relegated).
 *
 * Awards / random end-of-season events / EHL hooks are NOT wired yet —
 * Mutasarja is an MHM 2000 addition and the inherited MHM 97 awards
 * pipeline is intentionally limited to PHL + Divisioona for now.
 */
const mutasarja: CompetitionDefinition = {
  data: {
    abbr: "mut",
    weight: 1500,
    id: "mutasarja",
    phase: -1,
    name: "Mutasarja",
    teams: [
      24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
      42, 43, 44, 45, 46, 47
    ],
    phases: []
  },

  doesTravelApply: (_phase) => true,

  homeAndAwayTeamAdvantages: (_phase) => {
    return {
      home: 1.0,
      away: 0.85
    };
  },

  relegateTo: false,
  promoteTo: "division",

  moraleBoost: (_phase, facts, _manager) => {
    return defaultMoraleBoost(facts);
  },

  seed: [
    // Phase 0: runkosarja, two RR groups of 12. Random partition.
    (competitions: Record<string, Competition>) => {
      const competition = competitions.mutasarja;
      const shuffled = competition.teams.toSorted(() => r.real(1, 1000) - 500);
      const groupA = shuffled.slice(0, 12);
      const groupB = shuffled.slice(12, 24);
      const times = 2;
      const colors = [
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
        "l",
        "l"
      ];
      return {
        teams: shuffled,
        name: "runkosarja",
        type: "round-robin" as const,
        times,
        groups: [
          {
            penalties: [],
            type: "round-robin" as const,
            round: 0,
            name: "lohko A",
            teams: groupA,
            schedule: roundRobinScheduler(groupA, times),
            stats: [],
            colors
          },
          {
            penalties: [],
            type: "round-robin" as const,
            round: 0,
            name: "lohko B",
            teams: groupB,
            schedule: roundRobinScheduler(groupB, times),
            stats: [],
            colors
          }
        ]
      };
    },

    // Phase 1: round of 12 playoffs. Top 6 of each group, reseeded by
    // combined runkosarja points (best vs worst).
    (competitions: Record<string, Competition>) => {
      const groups = competitions.mutasarja.phases[0].groups;
      const top6 = groups.flatMap((g) => (g.stats as TeamStat[]).slice(0, 6));
      const ranked = sortStats(top6);
      const teams = ranked.map((s) => s.id);

      const matchupList: [number, number][] = [
        [teams[0], teams[11]],
        [teams[1], teams[10]],
        [teams[2], teams[9]],
        [teams[3], teams[8]],
        [teams[4], teams[7]],
        [teams[5], teams[6]]
      ];
      const winsToAdvance = 3;

      return {
        name: "12 parhaan playoffit",
        type: "playoffs" as const,
        teams,
        groups: [
          {
            type: "playoffs" as const,
            round: 0,
            name: "12 parhaan playoffit",
            teams,
            matchups: matchupList,
            winsToAdvance,
            schedule: playoffScheduler(matchupList, winsToAdvance),
            stats: []
          }
        ]
      };
    },

    // Phase 2: round of 8. Six winners from phase 1, joined by the two
    // worst Divisioona runkosarja teams as seeds 1 and 2 (easiest
    // matchups).
    (competitions: Record<string, Competition>) => {
      const prev = competitions.mutasarja.phases[1].groups[0] as PlayoffGroup;
      const phase1Winners = victors(prev).map((t) => t.id);

      const divStats = competitions.division.phases[0].groups[0]
        .stats as TeamStat[];
      const divLast = divStats[divStats.length - 1].id;
      const divSecondLast = divStats[divStats.length - 2].id;

      // Seeds 0 & 1 = the two relegation candidates from Divisioona.
      // Seeds 2..7 = the six phase-1 winners in their phase-1 seed order
      // (which preserves the runkosarja ranking).
      const teams = [divLast, divSecondLast, ...phase1Winners];

      const matchupList: [number, number][] = [
        [teams[0], teams[7]],
        [teams[1], teams[6]],
        [teams[2], teams[5]],
        [teams[3], teams[4]]
      ];
      const winsToAdvance = 3;

      return {
        name: "8 parhaan playoffit",
        type: "playoffs" as const,
        teams,
        groups: [
          {
            type: "playoffs" as const,
            round: 0,
            name: "8 parhaan playoffit",
            teams,
            matchups: matchupList,
            winsToAdvance,
            schedule: playoffScheduler(matchupList, winsToAdvance),
            stats: []
          }
        ]
      };
    },

    // Phase 3: round of 4. Four winners → two matchups → two promoted
    // teams. No further final between the two winners.
    (competitions: Record<string, Competition>) => {
      const prev = competitions.mutasarja.phases[2].groups[0] as PlayoffGroup;
      const teams = victors(prev).map((t) => t.id);

      const matchupList: [number, number][] = [
        [teams[0], teams[3]],
        [teams[1], teams[2]]
      ];
      const winsToAdvance = 3;

      return {
        name: "noususarja",
        type: "playoffs" as const,
        teams,
        groups: [
          {
            type: "playoffs" as const,
            round: 0,
            name: "noususarja",
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

export default mutasarja;
