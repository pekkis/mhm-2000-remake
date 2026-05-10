import type {
  Competition,
  CompetitionDefinition,
  Pairing
} from "@/types/competitions";

/**
 * Harjoitusottelut — preseason friendlies. Calendar entries with
 * `kiero === 4` (4 rounds in preseason). Match results don't feed any
 * standings; in QB they exist mainly as a tactical sandbox before the
 * real season starts.
 *
 * Structure: 1 phase with 1 group of type `independent-games`. The
 * group has 4 rounds in its schedule (one per training calendar day).
 *
 * NOTE: pairing logic is not yet decoded — the schedule currently
 * holds 4 empty rounds. The engine tolerates rounds with zero
 * pairings (does nothing, advances `group.round`). Real pairings to
 * be filled in once the `harjoitusottelu` SUB is decoded from the QB
 * source.
 */

const PRACTICE_ROUND_COUNT = 4;

const emptySchedule = (): Pairing[][] =>
  Array.from({ length: PRACTICE_ROUND_COUNT }, () => []);

const practice: CompetitionDefinition = {
  data: {
    abbr: "har",
    weight: 500,
    id: "practice",
    phase: -1,
    name: "Harjoitusottelut",
    teams: [],
    phases: []
  },

  doesTravelApply: (_phase) => true,

  homeAndAwayTeamAdvantages: (_phase) => {
    return {
      home: 1.0,
      away: 0.95
    };
  },

  relegateTo: false,
  promoteTo: false,

  moraleBoost: (_phase, _facts, _manager) => 0,

  seed: [
    (_competitions: Record<string, Competition>) => {
      // TODO: populate `teams` + `schedule` with actual training-match
      // pairings once the QB SUB is decoded.
      const teams: number[] = [];

      return {
        name: "Harjoitusottelut",
        type: "independent-games" as const,
        teams,
        groups: [
          {
            type: "independent-games" as const,
            round: 0,
            name: "Harjoitusottelut",
            teams,
            schedule: emptySchedule(),
            stats: []
          }
        ]
      };
    }
  ]
};

export default practice;
