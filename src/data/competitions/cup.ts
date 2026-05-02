import type { CompetitionDefinition } from "@/types/competitions";

/**
 * Pekkalan Cup — MHM 2000's domestic cup (single-elimination), filling
 * the calendar slots with `kiero === 3`. Real bracket logic still TODO;
 * this stub exists so the calendar can name `"cup"` as a gameday id
 * and the seeder/gameday code paths don't blow up before we wire the
 * scheduler in.
 *
 * QB references:
 *  - `cuparpo` SUB performs the round draws
 *  - 32 → 16 → 8 → 4 → 2 → 2-leg final (calendar entries 95-96)
 */
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
        home: (_team) => 0,
        away: (_team) => 0
      },
      base: () => 20,
      moraleEffect: (team) => team.morale * 2
    })
  },

  seed: []
};

export default cup;
