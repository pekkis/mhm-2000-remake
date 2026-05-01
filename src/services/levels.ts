import { teamLevels, type TeamLevelDefinition } from "@/data/levels";

/**
 * The 20 human-readable "material tier" labels for CPU team strength,
 * ordered from worst (`materialTiers[0]`) to best (`materialTiers[19]`).
 *
 * Source: `src/mhm2000-qb/DATA/MATERIA.M2K` (cp850 → UTF-8). The label
 * order ("PARHAASTA HUONOIMPAAN") in `HELP/19.HLP` is the reverse.
 */
const materialTiers: readonly string[] = [
  "TÄYSI NOLLA",
  "SUORAAN ANUKSESTA",
  "KATASTROFAALINEN",
  "SURKEAAKIN SURKEAMPI",
  "KAUHEAN KEHNO",
  "LUOKATON",
  "ALA-ARVOINEN",
  "TÄYSIN OSAAMATON",
  "ONNETON",
  "HUONOHKO",
  "MITÄÄNSANOMATON",
  "KESKINKERTAINEN",
  "MUKIINMENEVÄ",
  "HYVÄ KOKONAISUUS",
  "OSAAMISTAKIN LÖYTYY",
  "TAIDOKASTA PORUKKAA",
  "TERÄKSINEN",
  "MAAILMANLUOKKAAN KUULUVAA",
  "SUPERTÄHTIEN TYYSSIJA",
  "TAIVAALLISEN MESSIAANINEN"
] as const;

/**
 * 58 → 20 mapping from team level (`tazo`) to material tier index
 * (1-based as in the QB original). Sourced from
 * `src/mhm2000-qb/DATA/MATERIAX.M2K`. Note the heavy clustering at
 * both ends — levels 1..8 all collapse to tier 1 ("TÄYSI NOLLA"), and
 * levels 41..58 all saturate at tier 20 ("TAIVAALLISEN MESSIAANINEN").
 */
const levelToTier: readonly number[] = [
  1, 1, 1, 1, 1, 1, 1, 1, // 1..8
  2, 2, 2, // 9..11
  3, 3, 3, // 12..14
  4, 4, 4, // 15..17
  5, 5, 5, // 18..20
  6, 6, // 21..22
  7, 7, // 23..24
  8, // 25
  9, // 26
  10, // 27
  11, // 28
  12, // 29
  13, // 30
  14, // 31
  15, // 32
  16, // 33
  17, 17, // 34..35
  18, 18, // 36..37
  19, 19, 19, // 38..40
  20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20 // 41..58
];

export function getMaterialTier(level: number): string {
  const tierIndex = levelToTier[level - 1];
  if (tierIndex === undefined) {
    throw new Error(`Invalid team level: ${level} (expected 1..58)`);
  }
  // levelToTier values are 1-based, materialTiers is 0-based.
  return materialTiers[tierIndex - 1];
}

export function getTeamLevel(level: number): TeamLevelDefinition {
  const def = teamLevels[level - 1];
  if (def === undefined) {
    throw new Error(`Invalid team level: ${level} (expected 1..58)`);
  }
  return def;
}
