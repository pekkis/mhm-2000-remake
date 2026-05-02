// MHM 2000 difficulty levels (vai 1..5).
//
// Sourced from QB:
//   - Names: src/mhm2000-qb/DATA/AL.MHM records 5..9 (rendered by
//     `lt "al", 4 + z` in MHM2K.BAS:1796).
//   - Per-level state is stored in the QB array `vai(1..4, pv)`:
//       vai(1) = chosen level (1..5)                — see MHM2K.BAS:1808
//       vai(2) = budget tier (BUDGET.M2K row, 1..3) — see MHM2K.BAS:1813-1834
//       vai(3) = sponsor scale percent (90..200)    — see ILEX5.BAS:6702
//                (scales `spr(curso, 20)` — the sponsor offer base value
//                inside SUB `sponsorit`)
//       vai(4) = post-match injury-roll percent              — see
//                MHM2K.BAS:1811, ILEX5.BAS:5634-5640
//                derived: vai(4) = 4 + vai(1) * 2
//   - Morale clamp from src/mhm2000-qb/DATA/DATAX.M2K rows 88..92
//     (max,min pairs), used in ILEX5.BAS:341-342.
//   - Character creation point pool (MHM2K.BAS:1482-1483):
//       IF vai(1) < 3 THEN curso = (3 - vai(1)) * 3
//   - Bonus actions on every **preseason** round (ILEX5.BAS:247-248):
//       IF kr > 1 THEN actiox(pv) = 999 ELSE actiox(pv) = aktion(kr)
//       IF vai(1) < 3 THEN actiox(pv) = actiox(pv) + 3 - vai(1)
//     `kr` runs -9..kierrosmax (season rollover sets `kr = -9` at
//     ILEX5.BAS:7702); the AKTION.M2K table covers the 11 preseason
//     rounds (kr ∈ -9..1), and `actiox = 999` from kr=2 onwards makes
//     actions effectively unlimited during regular play. The +bonus is
//     therefore added on every one of those 11 preseason rounds.
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
// drains `raha(pv)` faster, AND a lower `sponsorScalePercent` shrinks
// the income side. Together they turn the screws on cash flow and make
// the manager more dependent on loans — but the loans themselves are
// identical for everyone. The `mafia` flag fires on any Ivan loan at
// any difficulty.

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
   * Extra actions added to the per-preseason-round budget on top of
   * `aktion(kr)`. Applies to every preseason round (`kr ∈ -9..1`) — not
   * just the first. Once regular play starts (`kr >= 2`) `actiox` is
   * forced to 999 and the bonus is moot.
   */
  bonusActionsPreseason: number;

  /**
   * vai(4, pv) — percentage chance (0..100) that the post-match block
   * (`ILEX5.BAS:5634-5640`) injures a random healthy lineup player on
   * the manager's roster. Derived as `4 + id * 2` so it scales linearly
   * with difficulty. Mechanism:
   *   IF INT(101*RND) < vai(4, pv) THEN
   *     al 1                       ' pick a random non-injured player
   *     lukka = INT(44*RND) + 1    ' roll injury type 1..44 (INJURIES.M2K)
   *     dap 1                      ' pel.inj = loukka(lukka, valb(4, pv))
   *   END IF
   * Severity is softened by the manager's medical-budget slider
   * `valb(4, pv)`. Despite the in-source label "jäynä" (`SUB jaynacheck`
   * is unrelated and lives in JAYNAT.M2K), this is just the per-gameday
   * "random training injury" roll — not a true prank.
   *
   * Sibling rolls in the same block (NOT difficulty-scaled): a flat 5%
   * ban roll (`dap 2`) and a flat 20% mood-swing roll (`dap 3`).
   */
  postMatchInjuryRollPercent: number;

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
   * vai(3, pv) — percentage applied to the **sponsor offer base**
   * (`spr(curso, 20) = 20000 * (1 + sin1*0.07) * (vai(3)/100)`,
   * ILEX5.BAS:6702, inside SUB `sponsorit`). All three sponsor offers
   * shown to the manager scale their payouts off this base, so the
   * effect is a flat multiplier on sponsor income:
   *   easy   (Nörttivatsa)  = 200 %  — sponsors throw money at you
   *   hard   (Katarrivatsa) =  90 %  — belt-tightening on the income side
   * (Note: this is NOT player salaries. Player wages are computed
   * elsewhere from `pel().sra` / `pel().svu` and don't reference `vai`.)
   */
  sponsorScalePercent: number;
};

export const difficultyLevels: readonly DifficultyLevel[] = [
  {
    id: 1,
    name: "Nörttivatsa",
    moraleMin: -5,
    moraleMax: 13,
    characterPoints: 6,
    bonusActionsPreseason: 2,
    postMatchInjuryRollPercent: 6,
    budgetTier: 1,
    sponsorScalePercent: 200
  },
  {
    id: 2,
    name: "Maitovatsa",
    moraleMin: -10,
    moraleMax: 10,
    characterPoints: 3,
    bonusActionsPreseason: 1,
    postMatchInjuryRollPercent: 8,
    budgetTier: 2,
    sponsorScalePercent: 140
  },
  {
    id: 3,
    name: "Kahvivatsa",
    moraleMin: -10,
    moraleMax: 10,
    characterPoints: 0,
    bonusActionsPreseason: 0,
    postMatchInjuryRollPercent: 10,
    budgetTier: 2,
    sponsorScalePercent: 120
  },
  {
    id: 4,
    name: "Haavavatsa",
    moraleMin: -10,
    moraleMax: 10,
    characterPoints: 0,
    bonusActionsPreseason: 0,
    postMatchInjuryRollPercent: 12,
    budgetTier: 2,
    sponsorScalePercent: 100
  },
  {
    id: 5,
    name: "Katarrivatsa",
    moraleMin: -15,
    moraleMax: 7,
    characterPoints: 0,
    bonusActionsPreseason: 0,
    postMatchInjuryRollPercent: 14,
    budgetTier: 3,
    sponsorScalePercent: 90
  }
] as const;

export const difficultyLevelById = (id: DifficultyLevelId): DifficultyLevel =>
  difficultyLevels[id - 1]!;
