import r from "@/services/random";
import { cupPairs, cupScheduler, cupVictors } from "@/services/cup";
import type {
  Competition,
  CompetitionDefinition,
  CupGroup
} from "@/types/competitions";

/**
 * Pekkalan Cup — 6-round single-elimination cup, 2-leg matchups (each
 * team hosts once, aggregate goals decide). Pairings are random at
 * every draw — no pre-computed brackets.
 *
 * Bracket size: 64 in round 1.
 *   PHL (12) + Divisioona (12) + Mutasarja (24) = 48 managed teams.
 *   Plus 16 random amateurs from `TEAMS.ALA` to fill the bracket.
 *
 * Phases (each = one bracket round, 2 calendar gamedays):
 *   0  R64 → R32   (1. kierros)
 *   1  R32 → R16   (2. kierros)
 *   2  R16 → R8    (3. kierros)
 *   3   R8 → R4    (puolivälierät)
 *   4   R4 → F     (välierät)
 *   5    F         (finaali, 2 legs at calendar 95-96)
 *
 * Calendar wiring (kiero3=2 cup-draw triggers): preseason seeds
 * phase 0; rounds 15, 30, 50, 61, 73, 97 each fire `cuparpo` to
 * produce the next phase's bracket from the previous phase's victors.
 *
 * TODO: amateur teams (`origin: "amateur"` in `light-teams.ts`) are
 * not yet seeded into `state.teams`. Until they are, the round-1
 * bracket holds only the 48 managed teams — still functional, just
 * misses 16 first-round bye-fodder amateurs.
 */

const PHASE_NAMES = [
  "Pekkalan Cup, 1. kierros",
  "Pekkalan Cup, 2. kierros",
  "Pekkalan Cup, 3. kierros",
  "Pekkalan Cup, puolivälierät",
  "Pekkalan Cup, välierät",
  "Pekkalan Cup, finaali"
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
    name: "Pekkalan Cup",
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
    // Phase 0: round of 64. Pool = PHL + Divisioona + Mutasarja
    // (+ 16 random amateurs once they're available in state.teams).
    (competitions: Record<string, Competition>) => {
      const pool = [
        ...competitions.phl.teams,
        ...competitions.division.teams,
        ...competitions.mutasarja.teams
        // TODO: + 16 random amateur ids once amateurs are in state.teams.
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
