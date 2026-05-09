/*
 * LEGACY adapter — kept zero-indexed (length 5, indices 0..4) for the
 * mountain of inherited MHM 97 call sites that do `difficultyLevels[m.difficulty]`.
 *
 * The canonical MHM 2000 picker (`src/data/mhm2000/difficulty-levels.ts`)
 * is the source of truth for `name` + `moraleMin` / `moraleMax`. Those
 * fields are mirrored here verbatim from the MHM 2000 module
 *
 * Manager-difficulty storage convention stays 0-based (0..4). The MHM 2000
 * `DifficultyLevelId` (1..5) is converted to the 0-based index at the
 * boundary (the new-game wizard).
 *
 * Original QB references for reference:
 *   IF vai = 1 AND mo < -6 THEN mo = -6
 *   IF vai = 2 AND mo < -10 THEN mo = -10
 *   IF vai = 3 AND mo < -14 THEN mo = -14
 *   IF vai = 4 AND mo < -18 THEN mo = -18
 *   IF vai = 5 AND mo < -22 THEN mo = -22
 *   IF mo > 12 THEN mo = 12
 *   IF vai = 5 AND mo > 8 THEN mo = 8
 */

import { difficultyLevels as mhm2kLevels } from "@/data/mhm2000/difficulty-levels";

export type DifficultyLevel = {
  value: number;
  name: string;
  moraleMin: number;
  moraleMax: number;
};

const difficultyLevels: DifficultyLevel[] = [
  {
    value: 0,
    name: mhm2kLevels[0].name,
    moraleMin: mhm2kLevels[0].moraleMin,
    moraleMax: mhm2kLevels[0].moraleMax
  },
  {
    value: 1,
    name: mhm2kLevels[1].name,
    moraleMin: mhm2kLevels[1].moraleMin,
    moraleMax: mhm2kLevels[1].moraleMax
  },
  {
    value: 2,
    name: mhm2kLevels[2].name,
    moraleMin: mhm2kLevels[2].moraleMin,
    moraleMax: mhm2kLevels[2].moraleMax
  },
  {
    value: 3,
    name: mhm2kLevels[3].name,
    moraleMin: mhm2kLevels[3].moraleMin,
    moraleMax: mhm2kLevels[3].moraleMax
  },
  {
    value: 4,
    name: mhm2kLevels[4].name,
    moraleMin: mhm2kLevels[4].moraleMin,
    moraleMax: mhm2kLevels[4].moraleMax
  }
];

export default difficultyLevels;
