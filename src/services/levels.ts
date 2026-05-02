import {
  teamLevels,
  type TeamLevelDefinition,
  type TeamStrength
} from "@/data/levels";
import { default as defaultRandom, type RandomService } from "./random";

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
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1, // 1..8
  2,
  2,
  2, // 9..11
  3,
  3,
  3, // 12..14
  4,
  4,
  4, // 15..17
  5,
  5,
  5, // 18..20
  6,
  6, // 21..22
  7,
  7, // 23..24
  8, // 25
  9, // 26
  10, // 27
  11, // 28
  12, // 29
  13, // 30
  14, // 31
  15, // 32
  16, // 33
  17,
  17, // 34..35
  18,
  18, // 36..37
  19,
  19,
  19, // 38..40
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20 // 41..58
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

/**
 * Faithful port of QB `SUB tasomaar` (MHM2K.BAS:2188, ILEZ5.BAS:1832) —
 * the CPU-team branch only. Given a team's tier (`tazo`, 1..58), looks up
 * the base goalie/defence/attack from TASOT.M2K and applies per-roll noise:
 *
 * ```basic
 * mw(zz) = lvl(tazo(zz)).maz + INT(3 * RND) - 1   ' goalie  ±1
 * pw(zz) = lvl(tazo(zz)).puz + INT(5 * RND) - 2   ' defence ±2
 * hw(zz) = lvl(tazo(zz)).hyz + INT(9 * RND) - 4   ' attack  ±4
 * ```
 *
 * `INT(N * RND)` is uniform `0..N-1`, so the offsets are uniform
 * `[-1, 1]` / `[-2, 2]` / `[-4, 4]` inclusive. We deliberately use
 * `random.integer` (not `cinteger`) — MHM 2000 QB never uses the biased
 * `CINT(...*RND)` form (see AGENTS.md "Randomness").
 *
 * This is the CPU path. The human-managed branch in QB recomputes from
 * the actual roster via `orgamaar`; that's a different function and
 * doesn't belong here.
 *
 * Called once per CPU team at season start (and on tier changes during
 * the season — see ILEZ5.BAS), so the noise is per-season, not per-match.
 */
export const createTeamStrengthService = (
  random: RandomService = defaultRandom
) => {
  const rollTeamStrength = (level: number): TeamStrength => {
    const base = getTeamLevel(level);
    return {
      goalie: base.goalie + random.integer(-1, 1),
      defence: base.defence + random.integer(-2, 2),
      attack: base.attack + random.integer(-4, 4)
    };
  };
  return { rollTeamStrength };
};

export const { rollTeamStrength } = createTeamStrengthService();
