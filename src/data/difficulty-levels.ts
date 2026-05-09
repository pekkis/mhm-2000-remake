/*
 * LEGACY adapter — kept zero-indexed (length 5, indices 0..4) for the
 * mountain of inherited MHM 97 call sites that do `difficultyLevels[m.difficulty]`.
 *
 * The canonical MHM 2000 picker (`src/data/mhm2000/difficulty-levels.ts`)
 * is the source of truth for `name` + `moraleMin` / `moraleMax`. Those
 * fields are mirrored here verbatim from the MHM 2000 module — the rest
 * (`startBalance`, `pranksPerSeason`, `extra`, `salary`, `rallyMorale`,
 * `rallyExtra`, `moraleBoost`, `description`) are MHM 97 holdovers
 * retrofitted onto the new shape until each consumer is ported. Per
 * the task brief: "When types break, retrofit fake versions from the
 * MHM 97 data."
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
  description: string;
  moraleMin: number;
  moraleMax: number;
  moraleBoost: number;
  startBalance: number;
  pranksPerSeason: number;
  salary: (competition: string) => number;
  rallyMorale: number;
  rallyExtra: (competition: string) => number;
};

const difficultyLevels: DifficultyLevel[] = [
  {
    value: 0,
    name: mhm2kLevels[0].name,
    description: "Sokeria, sokeria!",
    moraleMin: mhm2kLevels[0].moraleMin,
    moraleMax: mhm2kLevels[0].moraleMax,
    moraleBoost: 1,
    startBalance: 1000000,
    pranksPerSeason: 5,
    salary: (competition) => (competition === "phl" ? 2600 : 2000),
    rallyMorale: 33,
    rallyExtra: (competition) => (competition === "phl" ? 40000 : 10000)
  },
  {
    value: 1,
    name: mhm2kLevels[1].name,
    description: "Rutkasti maitoa, kiitos!",
    moraleMin: mhm2kLevels[1].moraleMin,
    moraleMax: mhm2kLevels[1].moraleMax,
    moraleBoost: 1,
    startBalance: 500000,
    pranksPerSeason: 4,
    salary: (competition) => (competition === "phl" ? 3000 : 2350),
    rallyMorale: 33,
    rallyExtra: (competition) => (competition === "phl" ? 35000 : 10000)
  },
  {
    value: 2,
    name: mhm2kLevels[2].name,
    description: "Kahvi kahvina, maito maitona",
    moraleMin: mhm2kLevels[2].moraleMin,
    moraleMax: mhm2kLevels[2].moraleMax,
    moraleBoost: 0,
    startBalance: 0,
    pranksPerSeason: 3,
    salary: (competition) => (competition === "phl" ? 3200 : 2700),
    rallyMorale: 33,
    rallyExtra: (competition) => (competition === "phl" ? 30000 : 10000)
  },
  {
    value: 3,
    name: mhm2kLevels[3].name,
    description: "Vahvan elämyksen ystäville",
    moraleMin: mhm2kLevels[3].moraleMin,
    moraleMax: mhm2kLevels[3].moraleMax,
    moraleBoost: -1,
    startBalance: -250000,
    pranksPerSeason: 2,
    salary: (competition) => (competition === "phl" ? 3500 : 2900),
    rallyMorale: 33,
    rallyExtra: (competition) => (competition === "phl" ? 25000 : 10000)
  },
  {
    value: 4,
    name: mhm2kLevels[4].name,
    description: "Todellista tervanjuontia",
    moraleMin: mhm2kLevels[4].moraleMin,
    moraleMax: mhm2kLevels[4].moraleMax,
    moraleBoost: -1,
    startBalance: -600000,
    pranksPerSeason: 1,
    salary: (competition) => (competition === "phl" ? 4000 : 3200),
    rallyMorale: 15,
    rallyExtra: (competition) => (competition === "phl" ? 20000 : 10000)
  }
];

export default difficultyLevels;
