// MHM 2000 difficulty levels (vai 1..5).
//
// Sourced from QB:
//   - Names: src/mhm2000-qb/DATA/AL.MHM records 5..9 (rendered by
//     `lt "al", 4 + z` in MHM2K.BAS:1796).
//   - Per-level state is stored in the QB array `vai(1..4, pv)`:
//       vai(1) = chosen level (1..5)                — see MHM2K.BAS:1808
//       vai(2) = budget tier (BUDGET.M2K row, 1..3) — see MHM2K.BAS:1813-1834
//       vai(3) = salary scale percent (90..200)     — see ILEX5.BAS:6702
//       vai(4) = jäynä-day trigger threshold        — see MHM2K.BAS:1811,
//                                                     ILEX5.BAS:5634
//                derived: vai(4) = 4 + vai(1) * 2
//   - Morale clamp from src/mhm2000-qb/DATA/DATAX.M2K rows 88..92
//     (max,min pairs), used in ILEX5.BAS:341-342.
//   - Character creation point pool (MHM2K.BAS:1482-1483):
//       IF vai(1) < 3 THEN curso = (3 - vai(1)) * 3
//   - Bonus actions on the very first round (ILEX5.BAS:248):
//       IF vai(1) < 3 THEN actiox(pv) = actiox(pv) + 3 - vai(1)
//
// IMPORTANT vs MHM 97: levels 4 and 5 were renamed from "Vatsahaava" /
// "Vatsakatarri" to "Haavavatsa" / "Katarrivatsa" — Forster wanted every
// level to end in `-vatsa`. Preserve the new names verbatim.
//
// What difficulty does NOT control in MHM 2000 (despite MHM 97 doing so):
//   - Starting cash. `raha(pv)` is set in `orgamaar` from ORGA.M2K based
//     on team strength `(sed+sedd+seddd)/3`, NOT difficulty
//     (MHM2K.BAS:2012). Every difficulty starts at the same team-
//     strength-derived bank balance.
//   - Bank availability. The bank UI (ILEX5.BAS:4080-4137) walks all
//     three banks unconditionally; every manager can borrow from MëRITÄ,
//     VÄLIVETO OY, and IVAN'S INVEST regardless of `vai`. The per-team
//     loan ceiling is `luotto(bank) * (4 - sr(team))` — a function of
//     series tier, not difficulty.
//
// Difficulty's interaction with the banking system is therefore purely
// indirect: a higher `budgetTier` makes the right-end budget sliders
// hilariously expensive (-18 000/round + -1 200/player/round at tier 3
// vs -7 000/round + -400/player/round at tier 1, see BUDGET.M2K), which
// drains `raha(pv)` faster, which makes the manager more dependent on
// loans — but the loans themselves are identical for everyone. The
// `mafia` flag fires on any Ivan loan at any difficulty.

export type DifficultyLevelId = 1 | 2 | 3 | 4 | 5;

/** Index into BUDGET.M2K's first dimension (`valbh(tier, category, choice)`). */
export type BudgetTierId = 1 | 2 | 3;

export type DifficultyLevel = {
  /** vai(1, pv). 1 = easiest (Nörttivatsa), 5 = hardest (Katarrivatsa). */
  id: DifficultyLevelId;

  /** Verbatim Finnish label from AL.MHM. Shown on the difficulty picker. */
  name: string;

  /**
   * Manager-morale floor. Below this, `mo(xx)` is clamped up.
   * From DATAX.M2K row 88 + (id - 1).
   */
  moraleMin: number;

  /**
   * Manager-morale ceiling. Above this, `mo(xx)` is clamped down.
   * From DATAX.M2K row 88 + (id - 1).
   */
  moraleMax: number;

  /**
   * Pool of character-creation points (`maaritakarakter` in MHM2K.BAS).
   * Higher difficulty = no points = stuck with the rolled persona.
   */
  characterPoints: number;

  /**
   * Extra actions added to the round-1 budget on top of `aktion(1)`.
   * Only granted on the very first round of the very first season.
   */
  bonusActionsRoundOne: number;

  /**
   * vai(4, pv) — per-day percentage chance (0..100) that a "self-jäynä"
   * (`al 1` → `dap 1`) triggers against the manager. Derived as
   * `4 + id * 2` so it scales linearly with difficulty.
   */
  jaynaDayChancePercent: number;

  /**
   * vai(2, pv) — index into the first dimension of BUDGET.M2K's
   * `valbh(1..3, 1..5, 1..5)` table. Same five budget categories
   * (training, intensity, scouting, …) for everyone, but the cost of
   * the right-end choices balloons with the tier:
   *   tier 1 (easy):   max-spend round  =  -7 000  + per-player -400
   *   tier 2 (medium): max-spend round  = -11 000  + per-player -1 000
   *   tier 3 (hard):   max-spend round  = -18 000  + per-player -1 200
   * Used at ILEX5.BAS:1124 (UI), 3563/3565/3571 (per-round drain),
   * 5378/5384 (season summary). NOT used by the bank UI — banks are
   * difficulty-agnostic.
   */
  budgetTier: BudgetTierId;

  /**
   * vai(3, pv) — percentage applied to the new-player offer salary
   * baseline (`spr(curso, 20) = 20000 * (1 + sin1*0.07) * (vai(3)/100)`,
   * ILEX5.BAS:6702). Counter-intuitively inverted vs MHM 97: easy mode
   * = 200 % (players demand more), hard mode = 90 % (players demand
   * less). The intent is presumably that hard-mode managers can still
   * scrape together a roster despite the budget squeeze, while easy
   * mode players come pre-loaded with cash and inflated payrolls.
   */
  salaryScalePercent: number;
};

export const difficultyLevels: readonly DifficultyLevel[] = [
  {
    id: 1,
    name: "Nörttivatsa",
    moraleMin: -5,
    moraleMax: 13,
    characterPoints: 6,
    bonusActionsRoundOne: 2,
    jaynaDayChancePercent: 6,
    budgetTier: 1,
    salaryScalePercent: 200
  },
  {
    id: 2,
    name: "Maitovatsa",
    moraleMin: -10,
    moraleMax: 10,
    characterPoints: 3,
    bonusActionsRoundOne: 1,
    jaynaDayChancePercent: 8,
    budgetTier: 2,
    salaryScalePercent: 140
  },
  {
    id: 3,
    name: "Kahvivatsa",
    moraleMin: -10,
    moraleMax: 10,
    characterPoints: 0,
    bonusActionsRoundOne: 0,
    jaynaDayChancePercent: 10,
    budgetTier: 2,
    salaryScalePercent: 120
  },
  {
    id: 4,
    name: "Haavavatsa",
    moraleMin: -10,
    moraleMax: 10,
    characterPoints: 0,
    bonusActionsRoundOne: 0,
    jaynaDayChancePercent: 12,
    budgetTier: 2,
    salaryScalePercent: 100
  },
  {
    id: 5,
    name: "Katarrivatsa",
    moraleMin: -15,
    moraleMax: 7,
    characterPoints: 0,
    bonusActionsRoundOne: 0,
    jaynaDayChancePercent: 14,
    budgetTier: 3,
    salaryScalePercent: 90
  }
] as const;

export const difficultyLevelById = (id: DifficultyLevelId): DifficultyLevel =>
  difficultyLevels[id - 1]!;
