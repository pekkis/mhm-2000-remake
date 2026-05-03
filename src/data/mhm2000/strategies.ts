/**
 * MHM 2000 season strategies (`valm` in the QB source).
 *
 * Each base team picks one of three strategies for the season. The choice
 * defines the season-arc shape of the team's readiness multiplier (`tre`
 * in the QB source) — a per-team scalar that gates into the match-prep
 * formula in `SUB ottpel` (ILEX5.BAS:3846).
 *
 * QB references:
 * - Strategy names loaded from DATAX.M2K rows 46-48 into `valms(1..3)`
 *   (MHM2K.BAS:276, 812).
 * - Human menu pick: ILEX5.BAS:8324-8335 (`valm(u(pv)) = kurso`).
 * - AI pick by sort rank: MHM2K.BAS:2497-2501, ILEZ5.BAS:2030-2034.
 * - Light teams forced to `valm = 0` (no strategy): ILEX5.BAS:7713.
 * - Help text: HELP/27.HLP.
 *
 * Algorithm:
 * - Season start (SUB `tremaar`, ILEX5.BAS:7458-7464) initialises `tre(xx)`
 *   from the chosen strategy, then for non-Tasainen strategies adds a
 *   manager-skill bonus `mtaito(1, man(xx)) * .007`.
 * - Per round (ILEX5.BAS:1574, inside the gameday loop, every non-preseason
 *   round) drifts `tre(xx)` by ±0.0025 depending on the strategy.
 *
 * QB IDs (1/2/3) are preserved here; `0` means "no strategy" (light teams).
 */

export type StrategyId = 1 | 2 | 3;

export type Strategy = {
  /** QB `valm` value. */
  id: StrategyId;
  /** Display name as shown in MHM 2000 (matches `valms(id)` from DATAX.M2K). */
  name: string;
  /** In-game description. */
  description: string;
  /**
   * Base value of `tre(xx)` written by `SUB tremaar` at season start, before
   * the manager-skill bonus is applied. Multiplier centred on 1.0.
   *
   * QB: ILEX5.BAS:7459
   * `IF valm = 1 THEN tre = .945 ELSE IF valm = 2 THEN tre = 1.055 ELSE tre = 1`
   */
  initialReadiness: () => number;
  /**
   * Per-round delta applied to `tre(xx)` every non-preseason round.
   * Runs unconditionally for all 48 base teams; light teams have `valm = 0`
   * and skip this branch entirely.
   *
   * QB: ILEX5.BAS:1574
   * `IF valm = 1 THEN tre += .0025 ELSE IF valm = 2 THEN tre -= .0025`
   * (Tasainen Puurto: no drift.)
   */
  incrementReadiness: () => number;
  /**
   * Coefficient applied to the manager's training skill (`mtaito(1, man(xx))`)
   * and added to the initial `tre(xx)` for non-Tasainen strategies. Zero for
   * Tasainen Puurto (`valm = 3`), which never gets the bonus.
   *
   * QB: ILEX5.BAS:7460-7462
   * `IF valm <> 3 THEN tre = tre + (mtaito(1, man(xx)) * .007)`
   */
  managerSkillBonusCoefficient: number;
};

/**
 * Calendar-entry tag marking a round on which `tre()` drifts.
 *
 * QB: the increment block in ILEX5.BAS:1574 sits inside `CASE 1` of the
 * `gameday` SUB's outer `SELECT CASE kiero(kr)` (ILEX5.BAS:1492). It runs
 * exclusively on `kiero(kr) = 1` rounds — PHL/Divisioona/Mutasarja
 * runkosarja gamedays. NOT on:
 *   - `kiero = 4`  training matches (preseason)
 *   - `kiero = 2`  EHL gamedays
 *   - `kiero = 3`  cup gamedays
 *   - `kiero = 22` EHL final tournament
 *   - `kiero = 41..47` playoffs / gala
 *   - `kiero = 96..99` free / national-team / invitation / preseason
 *
 * Every regular-season `kiero = 1` calendar entry in
 * `src/data/calendar.ts` carries this tag. The `executeCalculations`
 * action in `src/machines/game.ts` reads it as the gate.
 */
export const READINESS_TICK_TAG = "readiness-tick";

/**
 * Manager-tag prefix used to hard-code a season-strategy choice. When a
 * manager carries `strategy:<slug>`, AI strategy selection MUST honour
 * that pick (skipping the random `mahd()` distribution).
 *
 * QB precedent: ILEZ5.BAS:2030 / MHM2K.BAS:2497 hard-codes Juri Simonov
 * (manager id 33) onto `valm = 1`. We generalise it to a tag so the same
 * mechanism handles our shared light-team proxy (forced to Tasainen).
 */
const STRATEGY_TAG_PREFIX = "strategy:";

const strategyByTagSlug: Record<string, StrategyId> = {
  simonov: 1,
  "kaikki-peliin": 2,
  "tasainen-puurto": 3
};

/**
 * Returns the strategy a manager is hard-coded to pick, or `undefined`
 * if no `strategy:*` tag is present (let the AI distribution decide).
 */
export const forcedStrategyForManager = (
  managerTags: readonly string[]
): StrategyId | undefined => {
  for (const tag of managerTags) {
    if (!tag.startsWith(STRATEGY_TAG_PREFIX)) {
      continue;
    }
    const slug = tag.slice(STRATEGY_TAG_PREFIX.length);
    const strategy = strategyByTagSlug[slug];
    if (strategy !== undefined) {
      return strategy;
    }
  }
  return undefined;
};

/**
 * Computes the per-team initial readiness multiplier for a given
 * strategy and the manager's STRATEGIAT attribute (`mtaito(1, man)`).
 * 1-1 port of `SUB tremaar` (ILEX5.BAS:7458-7464):
 *
 *   tre = initialReadiness(strategy)
 *   IF strategy <> 3 THEN tre += managerStrategySkill * 0.007
 *
 * For light-team / proxy managers `managerStrategySkill = 0` zeroes the
 * bonus regardless of strategy.
 */
export const initialReadinessFor = (
  strategy: StrategyId,
  managerStrategySkill: number
): number => {
  const def = strategies[strategy];
  return def.initialReadiness() + managerStrategySkill * def.managerSkillBonusCoefficient;
};

const strategies: Record<StrategyId, Strategy> = {
  1: {
    id: 1,
    name: "JURI SIMONOV",
    description:
      "Joukkue treenaa rajusti koko kesän ja syksyn, ja peliesitykset kärsivät. Talven mittaan pelaajien uskomaton kuntopohja alkaa kuitenkin kantaa hedelmää, ja keväällä joukkuetta ei pysäytä mikään.",
    initialReadiness: () => 0.945,
    incrementReadiness: () => 0.0025,
    managerSkillBonusCoefficient: 0.007
  },
  2: {
    id: 2,
    name: "KAIKKI PELIIN!",
    description:
      "Joukkue on vahvimmillaan kauden alussa, ja heikkenee sen edetessä. Tahti on kova, mutta pojat hiipuvat kevättä kohden melkoisesti.",
    initialReadiness: () => 1.055,
    incrementReadiness: () => -0.0025,
    managerSkillBonusCoefficient: 0.007
  },
  3: {
    id: 3,
    name: "TASAINEN PUURTO",
    description: "Tasainen suoritus läpi kauden, ei pahempia heilahteluja.",
    initialReadiness: () => 1,
    incrementReadiness: () => 0,
    managerSkillBonusCoefficient: 0
  }
};

export default strategies;
