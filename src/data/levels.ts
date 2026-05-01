/**
 * Team strength levels for computer-controlled teams.
 *
 * Sourced verbatim from `src/mhm2000-qb/DATA/TASOT.M2K` (58 rows × 3
 * columns). In the QB original, every CPU team holds an integer level
 * 1..58 in `tazo(team)` and resolves its goalie / defence / attack
 * figures by indexing into this table — see SUB `tasomaar`
 * ([MHM2K.BAS:2189](../mhm2000-qb/MHM2K.BAS)):
 *
 *     DIM lvl(1 TO 80) AS tazzo            ' fields: maz, puz, hyz
 *     OPEN "data\tasot.m2k" FOR INPUT AS #1
 *     FOR zz = 1 TO 58
 *       INPUT #1, lvl(zz).maz, lvl(zz).puz, lvl(zz).hyz
 *
 *     mw(zz) = lvl(tazo(zz)).maz + INT(3*RND) - 1   ' goalie  ±1
 *     pw(zz) = lvl(tazo(zz)).puz + INT(5*RND) - 2   ' defence ±2
 *     hw(zz) = lvl(tazo(zz)).hyz + INT(9*RND) - 4   ' attack  ±4
 *
 * Variable mapping: `maz` → `goalie`, `puz` → `defence`, `hyz`
 * → `attack`. The QB struct name `tazzo` (yes, really) collides with
 * the team-level array name `tazo` — kept here only as archaeological
 * trivia.
 *
 * Human-controlled teams compute their goalie/defence/attack
 * differently and do not consult this table.
 *
 * The level also indexes into the `materiax` → `materia` chain
 * (MATERIA.M2K, MATERIAX.M2K) to derive the human-readable "material
 * tier" label shown in the UI ("TAIVAALLISEN MESSIAANINEN" through
 * the 20 tiers in HELP/19.HLP).
 */
export type TeamLevelDefinition = {
  /** 1-based level id matching the row in TASOT.M2K (the QB `tazo()` value). */
  level: number;
  /** Goalie base. QB `lvl().maz`. Per-match noise: ±1. */
  goalie: number;
  /** Defence base. QB `lvl().puz`. Per-match noise: ±2. */
  defence: number;
  /** Attack base. QB `lvl().hyz`. Per-match noise: ±4. */
  attack: number;
};

/**
 * Realised team strength — what a team actually brings to a match. Same
 * shape as a `TeamLevelDefinition` minus the index (`level`), because at
 * runtime the strength is a *value*, no longer a row in TASOT.M2K.
 *
 * For CPU teams this is computed at season start by looking up the team's
 * tier (`tazo` → `TeamLevelDefinition`) and adding the per-match noise
 * applied by QB `tasomaar` (MHM2K.BAS:2188, ILEZ5.BAS:1832):
 *
 *     mw = lvl(tazo).maz + INT(3*RND) - 1   ' goalie  ±1
 *     pw = lvl(tazo).puz + INT(5*RND) - 2   ' defence ±2
 *     hw = lvl(tazo).hyz + INT(9*RND) - 4   ' attack  ±4
 *
 * For human-managed teams the same shape is computed from the actual
 * roster (QB `orgamaar`), bypassing the TASOT.M2K lookup entirely.
 */
export type TeamStrength = Omit<TeamLevelDefinition, "level">;

export const teamLevels: readonly TeamLevelDefinition[] = [
  { level: 1, goalie: 2, defence: 6, attack: 12 },
  { level: 2, goalie: 3, defence: 8, attack: 16 },
  { level: 3, goalie: 4, defence: 10, attack: 20 },
  { level: 4, goalie: 4, defence: 12, attack: 24 },
  { level: 5, goalie: 4, defence: 14, attack: 28 },
  { level: 6, goalie: 5, defence: 16, attack: 32 },
  { level: 7, goalie: 5, defence: 18, attack: 36 },
  { level: 8, goalie: 5, defence: 20, attack: 40 },
  { level: 9, goalie: 6, defence: 22, attack: 44 },
  { level: 10, goalie: 6, defence: 24, attack: 48 },
  { level: 11, goalie: 6, defence: 26, attack: 52 },
  { level: 12, goalie: 6, defence: 28, attack: 56 },
  { level: 13, goalie: 6, defence: 30, attack: 60 },
  { level: 14, goalie: 7, defence: 32, attack: 64 },
  { level: 15, goalie: 7, defence: 34, attack: 68 },
  { level: 16, goalie: 7, defence: 36, attack: 72 },
  { level: 17, goalie: 8, defence: 38, attack: 76 },
  { level: 18, goalie: 8, defence: 40, attack: 80 },
  { level: 19, goalie: 8, defence: 42, attack: 84 },
  { level: 20, goalie: 9, defence: 44, attack: 88 },
  { level: 21, goalie: 9, defence: 46, attack: 92 },
  { level: 22, goalie: 9, defence: 48, attack: 96 },
  { level: 23, goalie: 10, defence: 50, attack: 100 },
  { level: 24, goalie: 10, defence: 52, attack: 104 },
  { level: 25, goalie: 10, defence: 54, attack: 108 },
  { level: 26, goalie: 11, defence: 56, attack: 112 },
  { level: 27, goalie: 11, defence: 58, attack: 116 },
  { level: 28, goalie: 12, defence: 60, attack: 120 },
  { level: 29, goalie: 12, defence: 62, attack: 124 },
  { level: 30, goalie: 12, defence: 64, attack: 128 },
  { level: 31, goalie: 13, defence: 66, attack: 132 },
  { level: 32, goalie: 13, defence: 68, attack: 136 },
  { level: 33, goalie: 13, defence: 70, attack: 140 },
  { level: 34, goalie: 14, defence: 72, attack: 144 },
  { level: 35, goalie: 14, defence: 74, attack: 148 },
  { level: 36, goalie: 15, defence: 76, attack: 152 },
  { level: 37, goalie: 15, defence: 78, attack: 156 },
  { level: 38, goalie: 15, defence: 80, attack: 160 },
  { level: 39, goalie: 15, defence: 82, attack: 164 },
  { level: 40, goalie: 16, defence: 84, attack: 168 },
  { level: 41, goalie: 16, defence: 86, attack: 172 },
  { level: 42, goalie: 16, defence: 88, attack: 176 },
  { level: 43, goalie: 16, defence: 90, attack: 180 },
  { level: 44, goalie: 17, defence: 92, attack: 184 },
  { level: 45, goalie: 17, defence: 94, attack: 188 },
  { level: 46, goalie: 17, defence: 96, attack: 192 },
  { level: 47, goalie: 17, defence: 98, attack: 196 },
  { level: 48, goalie: 18, defence: 100, attack: 200 },
  { level: 49, goalie: 18, defence: 102, attack: 204 },
  { level: 50, goalie: 18, defence: 104, attack: 208 },
  { level: 51, goalie: 18, defence: 106, attack: 212 },
  { level: 52, goalie: 18, defence: 108, attack: 216 },
  { level: 53, goalie: 18, defence: 110, attack: 220 },
  { level: 54, goalie: 19, defence: 112, attack: 224 },
  { level: 55, goalie: 19, defence: 114, attack: 228 },
  { level: 56, goalie: 19, defence: 116, attack: 232 },
  { level: 57, goalie: 20, defence: 118, attack: 236 },
  { level: 58, goalie: 20, defence: 120, attack: 240 }
] as const;
