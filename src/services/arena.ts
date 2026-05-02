import {
  arenaUnitCosts,
  type Arena,
  type ArenaLevel
} from "@/data/mhm2000/teams";

/**
 * Arena economics — ported from QB `remppa(rampa%)` SUB at
 * `src/mhm2000-qb/ILES5.BAS:364-535`.
 *
 * Currency is **euros (€)** throughout; Pekkalandia joined the EU between
 * MHM 97 and MHM 2000. The QB sources still say "mk" in places — those
 * become euros 1:1 in the port (no FIM→EUR conversion factor; the budget
 * numbers are game-balance constants, not real-world money).
 *
 * Two project modes:
 *   `renovate` (rampa% = 1) — extend the current arena up to +10 % value
 *                  points. Bills 20 000 € per added point + 1 000 € overhead
 *                  per *total* point, then × builder multiplier.
 *   `build`    (rampa% = 2) — replace the arena from scratch. Bills
 *                  10 000 € per planned point, × architect mult, × builder
 *                  mult (each multiplier rounded to LONG between, see below).
 *
 * Both modes require a 20 % cash down payment up-front.
 *
 * ---
 *
 * ## QB rounding semantics (preserved verbatim)
 *
 * QuickBASIC coerces `DOUBLE → LONG` automatically on assignment to a LONG
 * variable, using **banker's rounding** (round-half-to-even). The QB SUB
 * stores costs in `rahna AS LONG`, so every `rahna = rahna * 0.95`-style
 * line silently rounds to the nearest even integer on .5 boundaries. To
 * reproduce the same totals on the same inputs, we round in the same places
 * with `qbCint()`, defined locally below.
 *
 * Sites that need it:
 *
 * - `renovationMaxValuePoints` — `CINT(1.1 * ppiste)`            (`ILES5.BAS:522`)
 * - `renovationCost` — final builder multiplier                  (`ILES5.BAS:471`)
 * - `newArenaCost`   — architect mult, then builder mult         (`ILES5.BAS:467-471`)
 * - `roundPayment`   — `CLNG(rahna / (uhatapa - 2000))` (renovate, `ILES5.BAS:540`)
 *                  or `CLNG(mpv / (uhatapa - 1000))`   (build,    `ILEX5.BAS:5479`)
 *
 * Most cases agree with `Math.round`; they differ only when the float ends
 * in exactly `.5`. `Math.round` rounds half *up* (1.5 → 2, 2.5 → 3); QB
 * `CINT` rounds half *to even* (1.5 → 2, 2.5 → 2). For the renovation cap
 * with integer ppiste the divergence hits whenever `ppiste mod 10 == 5`
 * (since `1.1n` ends in .5 there). The first 48 base teams happen to all
 * round the same way, but the difference is observable mid-game (e.g. an
 * arena renovated to 1135 ppiste hits the divergent case on the next
 * renovate). We preserve the QB behaviour rather than the convenient one.
 */

/**
 * QB `CINT` / implicit-LONG-coercion behaviour: round to nearest integer,
 * **half-to-even** (banker's rounding). Pure helper, used wherever the
 * original arena code lets a double fall into a `LONG` slot.
 *
 * For negative inputs QB CINT also rounds half-to-even (toward the nearest
 * even integer regardless of sign), so we mirror that here. Arena math only
 * ever sees positives, but keep the helper general so future ports of other
 * `CINT` sites can reuse it.
 */
export const qbCint = (value: number): number => {
  const floor = Math.floor(value);
  const frac = value - floor;
  if (frac < 0.5) {
    return floor;
  }
  if (frac > 0.5) {
    return floor + 1;
  }
  // Exactly .5 — pick the even neighbour.
  return floor % 2 === 0 ? floor : floor + 1;
};

/** `ppmaksu(1)` — renovation: cost per added value point, in €. */
export const RENOVATION_POINT_PRICE_EUR = 20_000;

/** `ppmaksu(2)` — new build: cost per planned value point, in €. */
export const NEW_ARENA_POINT_PRICE_EUR = 10_000;

/** Per-point overhead added to every renovation (`ILES5.BAS:470`). */
export const RENOVATION_OVERHEAD_EUR_PER_POINT = 1_000;

/** Renovation cap: planned points ≤ 1.1 × current points (`ILES5.BAS:522`). */
export const RENOVATION_MAX_GROWTH = 1.1;

/** New arenas must be sized above this many value points (`ILES5.BAS:493`). */
export const NEW_ARENA_MIN_VALUE_POINTS = 20;

/** Cash required up-front, fraction of total project cost (`ILES5.BAS:520`). */
export const DOWN_PAYMENT_FRACTION = 0.2;

/**
 * Architect / builder rank chosen by the manager. Higher rank = faster &
 * fancier, but more expensive (multiplier 0.95 / 1.00 / 1.05).
 */
export type BuildRank = 1 | 2 | 3;

/** `0.9 + rank * 0.05` (`ILES5.BAS:466, :468`). */
export const buildRankMultiplier = (rank: BuildRank): number =>
  0.9 + rank * 0.05;

/**
 * Builder ("rakennuttaja") option presented to the manager when starting a
 * project. Names from `Y.MHM` records 136-138, written verbatim by the
 * `lay 135 + rank` calls in `ILES5.BAS:457, :487`. Cost multiplier is
 * shared with architects via `buildRankMultiplier(rank)`.
 *
 * `renovationRounds` / `buildRounds` are the *number of gamedays* the
 * builder takes to finish the project. Higher rank = fewer rounds. The
 * total bill is split into per-round payments of `qbCint(total / rounds)`,
 * deducted from `potti` each round (`ILEX5.BAS:5485`); the project
 * resolves when the round counter (`uhatapa`) ticks down to its base
 * (1000 for build, 2000 for renovate).
 *
 * Sources:
 *   renovate: `uhatapa = 2030/2025/2020`, divisor 30/25/20 (`ILES5.BAS:539`)
 *   build:    `uhatapa = 1090/1080/1070`, divisor 90/80/70 (`ILEX5.BAS:5478`)
 */
export type Builder = {
  rank: BuildRank;
  name: string;
  costMultiplier: number;
  renovationRounds: number;
  buildRounds: number;
};

/**
 * Architect ("arkkitehti") option, presented only when starting a brand-new
 * arena (`kind: "build"`). Names from `Y.MHM` records 139-141, written by
 * the `lay 138 + rank` calls in `ILES5.BAS:454`.
 */
export type Architect = {
  rank: BuildRank;
  name: string;
  costMultiplier: number;
};

/** All three builders in rank order. Index `i` is rank `i + 1`. */
export const builders: readonly Builder[] = [
  {
    rank: 1,
    name: "Kunnan työmarkkinatukityöllistetyt",
    costMultiplier: buildRankMultiplier(1),
    renovationRounds: 30,
    buildRounds: 90
  },
  {
    rank: 2,
    name: "Kunnan vakituiset pojat",
    costMultiplier: buildRankMultiplier(2),
    renovationRounds: 25,
    buildRounds: 80
  },
  {
    rank: 3,
    name: "Ranen Rakennusfirma",
    costMultiplier: buildRankMultiplier(3),
    renovationRounds: 20,
    buildRounds: 70
  }
] as const;

/** All three architects in rank order. Index `i` is rank `i + 1`. */
export const architects: readonly Architect[] = [
  {
    rank: 1,
    name: "Arkkitehtiopiskelija Makkonen",
    costMultiplier: buildRankMultiplier(1)
  },
  {
    rank: 2,
    name: "Arkkitehtitoimisto Arvaja",
    costMultiplier: buildRankMultiplier(2)
  },
  {
    rank: 3,
    name: "Hjalvar Aalto",
    costMultiplier: buildRankMultiplier(3)
  }
] as const;

export const builderByRank = (rank: BuildRank): Builder => builders[rank - 1]!;
export const architectByRank = (rank: BuildRank): Architect =>
  architects[rank - 1]!;

/** `renovate` | `build` — discriminator for the project kind. */
export type ProjectKind = "renovate" | "build";

/**
 * Number of gamedays the construction takes for a given builder + project
 * kind. Renovate: 30/25/20 (rank 1/2/3). Build: 90/80/70.
 */
export const constructionRounds = (
  kind: ProjectKind,
  builder: BuildRank
): number => {
  const b = builderByRank(builder);
  return kind === "renovate" ? b.renovationRounds : b.buildRounds;
};

/**
 * Per-round payment (€) deducted from `potti` each gameday until the
 * project completes. `qbCint(totalCost / rounds)` — QB banker's rounding,
 * matching `CLNG(...)` at `ILES5.BAS:540` (renovate) and `ILEX5.BAS:5479`
 * (build).
 */
export const roundPayment = (
  totalCost: number,
  kind: ProjectKind,
  builder: BuildRank
): number => qbCint(totalCost / constructionRounds(kind, builder));

/**
 * Per-round "vetää lonkkaa" (slacking) check from `ILEX5.BAS:5485-5493`.
 * After the per-round payment is deducted, QB rolls `d = INT(100*RND)+1`
 * (1..100) and uses it twice:
 *
 *   slack message fires if  `d <= 3 - rakennuttaja(pv)`
 *   progress ticks down if  `d >= 3 - rakennuttaja(pv)`
 *
 * The two ranges overlap at `d == 3 - builder`, so the slack message and
 * a progress tick can fire on the same round. Net per-builder behaviour:
 *
 *   rank 1 (työllistetyt):  slack 2 % of rounds, lost day 1 % of rounds
 *   rank 2 (vakituiset):    slack 1 % (always still progresses)
 *   rank 3 (Ranen):         never slacks, never stalls
 *
 * The X.MHM rec 165 message ("LAKISÄÄTEISTEN KAHVITUNTIEN…") implies
 * "projekti seisoo" every time it fires — that's narrative flavour, not
 * mechanics. Only rank 1 ever actually loses a day. **This is almost
 * certainly a QB off-by-one bug** (the second IF should likely be `d > …`,
 * not `d >= …`); we preserve the original behaviour verbatim. See issue
 * #37 for the decision-later writeup.
 *
 * Pure helper: caller passes the roll (1..100) and gets back what to do.
 * Production code should source the roll from `random.integer(1, 100)`.
 */
export type ConstructionTick = {
  /** Show the X.MHM rec 165 slack message in news/log. */
  slacked: boolean;
  /** Tick `roundsRemaining` down by 1. False = the day was lost. */
  progressed: boolean;
};

export const tickConstruction = (
  builder: BuildRank,
  roll: number
): ConstructionTick => {
  const threshold = 3 - builder;
  return {
    slacked: roll <= threshold,
    progressed: roll >= threshold
  };
};

/**
 * Cost in arena value points of an arbitrary seat allocation at a given
 * level. Mirrors the ppiste derivation used by the renovate UI's free-points
 * counter (`ILES5.BAS:412-419`).
 *
 * QB itself does NOT round here — `gnome` is a plain numeric, so the × 1.2
 * stays as a double for the "free points" comparison. The stored ppiste in
 * TEAMS.PLN is whole numbers because all base allocations happen to land on
 * integers; we `Math.round` defensively so callers always see an int.
 */
export const seatAllocationPoints = (
  level: ArenaLevel,
  standingCount: number,
  seatedCount: number,
  hasBoxes: boolean
): number => {
  const unit = arenaUnitCosts[level];
  const standing = unit.standing < 0 ? 0 : standingCount * unit.standing;
  const seated = unit.seated < 0 ? 0 : seatedCount * unit.seated;
  const base = seated + standing;
  return hasBoxes && unit.box >= 0 ? Math.round(base * 1.2) : base;
};

/**
 * Free (unallocated) value points in a candidate arena plan. Negative means
 * the manager has over-allocated and the plan is invalid.
 */
export const arenaFreePoints = (plan: Arena): number =>
  plan.valuePoints -
  seatAllocationPoints(
    plan.level,
    plan.standingCount,
    plan.seatedCount,
    plan.hasBoxes
  );

/**
 * Maximum allowed planned value points when renovating (10 % growth ceiling,
 * QB `CINT(1.1 * ppiste)` at `ILES5.BAS:522`).
 */
export const renovationMaxValuePoints = (current: Arena): number =>
  qbCint(RENOVATION_MAX_GROWTH * current.valuePoints);

/**
 * Renovation bill (`ILES5.BAS:465-471`):
 *   `(planPoints − currentPoints) × 20 000 + planPoints × 1 000`
 *   then × builder multiplier (banker's-rounded into LONG).
 */
export const renovationCost = (
  current: Arena,
  planValuePoints: number,
  builder: BuildRank
): number => {
  const delta = planValuePoints - current.valuePoints;
  const base =
    delta * RENOVATION_POINT_PRICE_EUR +
    planValuePoints * RENOVATION_OVERHEAD_EUR_PER_POINT;
  return qbCint(base * buildRankMultiplier(builder));
};

/**
 * New-arena bill (`ILES5.BAS:465, :467, :471`):
 *   step 1: `planPoints × 10 000`                     (already integer)
 *   step 2: `× architectMult`                         → banker's round to LONG
 *   step 3: `× builderMult`                           → banker's round to LONG
 *
 * The two rounds are sequential and observable: rounding once with the
 * combined multiplier gives different totals.
 */
export const newArenaCost = (
  planValuePoints: number,
  architect: BuildRank,
  builder: BuildRank
): number => {
  const base = planValuePoints * NEW_ARENA_POINT_PRICE_EUR;
  const afterArchitect = qbCint(base * buildRankMultiplier(architect));
  return qbCint(afterArchitect * buildRankMultiplier(builder));
};

/**
 * Required cash down payment for any project (20 % of the bill).
 *
 * QB compares `rahna * .2 > potti(pv)` directly in floating point
 * (`ILES5.BAS:520`); the down payment is never displayed as its own number.
 * We expose the rounded euro value for UI; affordability checks should use
 * `canAffordProject` to stay bit-exact with the original comparison.
 */
export const downPayment = (totalCost: number): number =>
  qbCint(DOWN_PAYMENT_FRACTION * totalCost);

/** True iff the manager can cover the up-front fraction of `totalCost`. */
export const canAffordProject = (
  totalCost: number,
  cashOnHand: number
): boolean => cashOnHand >= DOWN_PAYMENT_FRACTION * totalCost;
