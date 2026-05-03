import r from "@/services/random";
import { cupPairs, cupScheduler, cupVictors } from "@/services/cup";
import type {
  Competition,
  CompetitionDefinition,
  CupGroup
} from "@/types/competitions";

/**
 * PA Cup — 6-round single-elimination cup, 2-leg matchups (each
 * team hosts once, aggregate goals decide). Pairings are random at
 * every draw — no pre-computed brackets.
 *
 * Bracket size: 64 in round 1.
 *   PHL (12) + Divisioona (12) + Mutasarja (24) = 48 managed teams.
 *   Plus 16 amateurs from `TEAMS.ALA` (state.teams ids 118..133).
 *
 * Phases (each = one bracket round, 2 calendar gamedays):
 *   0  R64 → R32   (1. kierros)
 *   1  R32 → R16   (2. kierros)
 *   2  R16 → R8    (3. kierros)
 *   3   R8 → R4    (puolivälierät)
 *   4   R4 → F     (välierät)
 *   5    F         (finaali, 2 legs at calendar 95-96)
 *
 * Calendar wiring: phase 0 seeded preseason; phases 1..5 seeded on the
 * leg-2 cup gameday immediately after the previous phase resolves
 * (rounds 14, 29, 49, 60, 72).
 */

const PHASE_NAMES = [
  "PA Cup, 1. kierros",
  "PA Cup, 2. kierros",
  "PA Cup, 3. kierros",
  "PA Cup, puolivälierät",
  "PA Cup, välierät",
  "PA Cup, finaali"
];

const shuffle = <T>(xs: readonly T[]): T[] =>
  xs.toSorted(() => r.real(1, 1000) - 500);

const seedFromVictors =
  (phaseIdx: number) => (competitions: Record<string, Competition>) => {
    const prev = competitions.cup.phases[phaseIdx - 1];
    const prevGroup = prev.groups[0] as CupGroup;
    const winners = cupVictors(prevGroup);
    const teams = shuffle(winners);
    const matchups = cupPairs(teams.length);
    const name = PHASE_NAMES[phaseIdx];
    return {
      name,
      type: "cup" as const,
      teams,
      groups: [
        {
          type: "cup" as const,
          round: 0,
          name,
          teams,
          matchups,
          schedule: cupScheduler(matchups),
          stats: []
        }
      ]
    };
  };

const cup: CompetitionDefinition = {
  data: {
    abbr: "cup",
    weight: 1800,
    id: "cup",
    phase: -1,
    name: "PA Cup",
    teams: [],
    phases: []
  },

  relegateTo: false,
  promoteTo: false,

  gameBalance: (_phase, _facts, _manager) => 0,
  moraleBoost: (_phase, _facts, _manager) => 0,
  readinessBoost: (_phase, _facts, _manager) => 0,

  parameters: {
    gameday: (_phase, _group) => ({
      advantage: {
        home: (_team) => 10,
        away: (_team) => -10
      },
      base: () => 20,
      moraleEffect: (team) => team.morale * 2
    })
  },

  seed: [
    // Phase 0: round of 64. Pool = PHL + Divisioona + Mutasarja + 16
    // amateur clubs (state.teams ids 118..133, see state/defaults.ts).
    (competitions: Record<string, Competition>) => {
      const AMATEUR_IDS = Array.from({ length: 16 }, (_, i) => 118 + i);
      const pool = [
        ...competitions.phl.teams,
        ...competitions.division.teams,
        ...competitions.mutasarja.teams,
        ...AMATEUR_IDS
      ];
      const teams = shuffle(pool);
      const matchups = cupPairs(teams.length);
      const name = PHASE_NAMES[0];
      return {
        name,
        type: "cup" as const,
        teams,
        groups: [
          {
            type: "cup" as const,
            round: 0,
            name,
            teams,
            matchups,
            schedule: cupScheduler(matchups),
            stats: []
          }
        ]
      };
    },
    seedFromVictors(1),
    seedFromVictors(2),
    seedFromVictors(3),
    seedFromVictors(4),
    seedFromVictors(5)
  ]
};

export default cup;
