/**
 * MHM 2000 — isolated AI-vs-AI match simulator.
 *
 * Faithful port of `SUB ottpel` ([ILEX5.BAS:3709-4017](../../mhm2000-qb/ILEX5.BAS))
 * restricted to the **two-AI-base-team** case (both teams managed by the
 * computer, both inside `od(z) < 49` so neither is a light NHL/foreign/
 * amateur side, and neither has a human manager).
 *
 * This is the smallest end-to-end vertical slice of the simulation: in →
 * two team strengths + a round type, out → a final score. Nothing is
 * wired into machines, state, or the calendar yet. The function is pure
 * (modulo the injected RandomService).
 *
 * QB context recap (read these notes BEFORE editing):
 *
 *   - `od(1)` = home team id, `od(2)` = away team id.
 *   - `mw(team)` / `pw(team)` / `hw(team)` = goalie / defence / attack
 *     base figures, set once per season at `tasomaar` from TASOT.M2K
 *     `lvl(tazo).maz / .puz / .hyz` plus per-match noise (±1 / ±2 / ±4).
 *     For our purposes the caller passes the post-noise values.
 *   - `yw(team)` / `aw(team)` = power-play / penalty-kill weights.
 *     For AI base teams these are computed by the per-round shadow at
 *     [ILEX5.BAS:328-329](../../mhm2000-qb/ILEX5.BAS):
 *
 *       yw(xx) = ((hw + tauti(2)) / 3.3 + (pw + tauti(3)) / 2.5)
 *                * (1 + (mtaito(2, man(xx)) * .04))
 *       aw(xx) = ((hw + tauti(2)) / 4.4 + (pw + tauti(3)) / 2.5)
 *                * (1 + (mtaito(2, man(xx)) * .04))
 *
 *     `tauti(d, tox(team))` = epidemic-illness defence/attack modifiers
 *     (TODO: not modelled here, defaulted to 0).
 *     `mtaito(2, man)` = manager's `specialTeams` attribute, range -3..+3.
 *   - `mo(team)` = team morale, clamped to -10..+10 by `SUB mor`.
 *   - `ohj(team) = 0` everywhere in this function — both teams are CPU.
 *
 * What this function intentionally does NOT model (yet) — every one of
 * these gets a TODO at its call site below:
 *
 *   - `erik(1..4, team)` services (faniryhmä, alkoholi, doping,
 *     travel) — only human managers buy these; AI `erik = 0`.
 *   - `tre(team)` trainer multiplier — TODO confirm AI-team default
 *     is 1.0 (looks that way; `tasomaar` doesn't set it, so it stays
 *     at the QB DIM-time zero-fill, but the read at line 3846/3850
 *     would then zero out yw/aw entirely. Almost certainly initialised
 *     to 1.0 elsewhere. Until decoded, we assume 1.0.).
 *   - `tautip(team)` epidemic multiplier — same TODO; assume 1.0.
 *   - `inte(team)` interest meter (-0.15..+0.10 etu swing) — human-only.
 *   - `treeni(team)` training intensity etu bonus (`* .03`) — TODO
 *     confirm AI-team default; almost certainly 0.
 *   - `spx(3, team)` voodoo curse / `spx(4, team)` dance troupe boosts —
 *     human-only consumables.
 *   - `pel().spe = 4 / 10` (extremelyFat / daddyPays) per-roster
 *     adjustments — needs roster modelling.
 *   - `jaynax(2, team)` boycott prank (forces 0-N or N-0 final) and
 *     `jaynax(6, team)` (zeroes ode) — needs prank pipeline.
 *   - The "league comeback handicap" at [ILEX5.BAS:3754-3762] which
 *     reads `s(team)` (current league position) and `ot` (match
 *     counter in season) to give trailing AI home teams a -.15 etu
 *     pity bump. Needs a season-state input we don't have here yet.
 *   - The "0 goals → forced 12-0 result" branch at
 *     [ILEX5.BAS:3856-3860]. Triggers only when one of the `ode`
 *     stats is non-positive after multipliers, which can't happen in
 *     the clean two-AI case (mw/pw/hw are always >= 0 and the
 *     multipliers we apply are >= 0.7).
 */

import defaultRandom, { type RandomService } from "@/services/random";

/**
 * One AI team as seen by the match engine. All fields trace back to a
 * specific QB array; comments mark the exact one.
 */
export type AiMatchTeam = {
  /** `od(z)` — team id. Used only for logging / equality, no math. */
  id: number;

  /** Display name. Not consumed by the math. */
  name: string;

  /**
   * `mw(team)` — goalie base. Already includes the per-season
   * `INT(3*RND) - 1` noise from `tasomaar`.
   */
  goalie: number;

  /**
   * `pw(team)` — defence base. Already includes the per-season
   * `INT(5*RND) - 2` noise.
   */
  defence: number;

  /**
   * `hw(team)` — attack base. Already includes the per-season
   * `INT(9*RND) - 4` noise.
   */
  attack: number;

  /**
   * `mtaito(2, man(team))` — the team manager's `specialTeams`
   * attribute, range -3..+3. Multiplier on PP/PK weights:
   * `yw *= 1 + 0.04 * specialTeams` (and same for `aw`).
   *
   * Only applied for managed base teams (`od(z) < 49`); light teams
   * (NHL / foreign / amateur, `od(z) >= 49`) skip it — see the
   * SELECT CASE at [ILEX5.BAS:326-334].
   */
  specialTeams: number;

  /**
   * `mo(team)` — current team morale, clamped to -10..+10 by `SUB mor`
   * ([ILEX5.BAS:3361]). Tweaks `etu` per the asymmetric formula at
   * [ILEX5.BAS:3771-3772]:
   *   - `mo < 0` → `etu += mo / 125`
   *   - `mo > 0` → `etu += mo / 155`
   * (Negative morale hurts more than positive morale helps.)
   */
  morale: number;
};

/**
 * Round type — the `kiero(kr)` value of the current round. Only the
 * codes that actually run a match are listed here (i.e. not 47/48/96/97
 * etc, which are gala / rollover / break days and never reach `ottpel`).
 *
 * See [src/data/mhm2000/calendar.ts](../../data/mhm2000/calendar.ts) for
 * the full kiero table.
 */
export type AiMatchRoundType =
  | 1 // regular gameday (PHL / Divisioona / Mutasarja)
  | 2 // EHL gameday
  | 3 // cup gameday — same etu shape as 1
  | 4 // training match (etu away = .95)
  | 42 // playoff QF gameday
  | 44 // playoff SF gameday
  | 46; // playoff Final gameday

/**
 * Per-round flags bundled together so we don't grow the function
 * signature every time a new mechanic is decoded.
 */
export type AiMatchRound = {
  type: AiMatchRoundType;
};

export type AiMatchResult = {
  /** Final score. */
  homeGoals: number;
  awayGoals: number;
  /** True iff overtime was needed to break a tie. */
  overtime: boolean;
  /**
   * Morale deltas to apply post-match (winner +1 / loser -1, no change
   * on a tie). Mirrors the `morttivertti:` block at
   * [ILEX5.BAS:3953-3960]. Tournament matches (`turnauz <> 0`) skip
   * this — out of scope for this function.
   */
  homeMoraleChange: number;
  awayMoraleChange: number;
};

// ─── helpers ─────────────────────────────────────────────────────────

/**
 * QB `RND` — uniform real in `[0, 1)`. Aliased for readability so the
 * port reads visibly close to the QB original.
 */
const rnd = (random: RandomService): number => random.real(0, 1);

/**
 * Compute the home/away `etu` (advantage) multipliers for a round.
 *
 * Mirrors the SELECT CASE at [ILEX5.BAS:3711-3749] for the two-AI-base
 * subset. Cases collapse heavily because every `erik(1, …)` /
 * `erik(4, …)` term is 0 for AI teams and every `od(z) >= 49` branch
 * is unreachable when both sides are managed base teams.
 */
const computeEtu = (round: AiMatchRound): { home: number; away: number } => {
  switch (round.type) {
    case 1: // regular
    case 2: // EHL — same shape as 1 once both teams are managed base teams
    case 3: // cup
    case 42: // playoff QF
    case 44: // playoff SF
    case 46: // playoff Final
      // QB: etu(1)=1, etu(2)=.85; the +0.02*erik(...) terms are 0 for AI.
      return { home: 1.0, away: 0.85 };

    case 4: // training match
      return { home: 1.0, away: 0.95 };
  }
};

/**
 * Apply the morale tweak to `etu`, matching [ILEX5.BAS:3771-3772]:
 *   IF mo < 0 THEN etu += mo / 125
 *   ELSE IF mo > 0 THEN etu += mo / 155
 */
const applyMoraleEtu = (etu: number, morale: number): number => {
  if (morale < 0) return etu + morale / 125;
  if (morale > 0) return etu + morale / 155;
  return etu;
};

/**
 * Strength tuple `ode(1..3, z)` for one side, after all multipliers.
 * Indices are 1-based in QB; we use named fields here.
 *
 *   QB: ode(1, z) = goalie / 30
 *       ode(2, z) = defence / 60
 *       ode(3, z) = attack / 120
 */
type SideStrength = {
  goalie: number; // ode(1, z) — used as last-line save check
  defence: number; // ode(2, z) — used as first-line block check
  attack: number; // ode(3, z) — drives both rolls
  yw: number; // PP weight
  aw: number; // PK weight
};

/**
 * Prep one side's `ode(*, z)` + `yw` / `aw` for the possession loop.
 *
 * Mirrors lines [ILEX5.BAS:3764-3879] folded down to the two-AI case
 * (no services, no consumables, no pranks, no roster scan, no
 * doping). All the omitted bits are tagged TODO in the file header.
 */
const prepareSide = (team: AiMatchTeam, etu: number): SideStrength => {
  // Pre-multiplier raw stats. QB:
  //   ode(1, z) = mw(od(z))
  //   ode(2, z) = pw(od(z))
  //   ode(3, z) = hw(od(z))
  // TODO: add `tauti(1..3, tox(team))` epidemic mods once we model
  //       per-team illness. For now these are 0.
  let goalie = team.goalie;
  let defence = team.defence;
  let attack = team.attack;

  // QB shadow at [ILEX5.BAS:328-329] — recomputed every gameday for
  // every AI base team via the menu3 loop. Same formula here.
  // TODO: fold in `tauti(2)` / `tauti(3)` epidemic mods once modelled.
  const specialTeamsMult = 1 + team.specialTeams * 0.04;
  let yw = (attack / 3.3 + defence / 2.5) * specialTeamsMult;
  let aw = (attack / 4.4 + defence / 2.5) * specialTeamsMult;

  // QB lines 3844-3851: tautip and tre multipliers for od(z) < 49.
  // TODO: model `tautip(team)` (epidemic) and `tre(team)` (trainer).
  //       Both default to 1.0 in the AI case (assumed; needs decode of
  //       `orgamaar` / `tasomaar` initialisation).
  const tautip = 1.0;
  const tre = 1.0;
  yw *= tautip * tre;
  aw *= tautip * tre;

  // Final etu scale of yw/aw (QB lines 3850-3851).
  yw *= etu;
  aw *= etu;

  // ode floors and final etu/tautip/tre scaling (QB lines 3853-3870).
  // The "ode <= 0 → forced 12-0" branch is unreachable in the clean
  // two-AI case; we don't replicate it.
  const scale = (raw: number): number => {
    let v = raw < 0 ? 0 : raw;
    v *= tautip;
    v *= tre;
    v *= etu;
    return v;
  };
  goalie = scale(goalie);
  defence = scale(defence);
  attack = scale(attack);

  // QB lines 3872-3874 — final divisors that turn raw stats into the
  // per-possession comparison values. The 30 / 60 / 120 ratios here
  // are load-bearing balance numbers; do NOT "tidy" them.
  return {
    goalie: goalie / 30,
    defence: defence / 60,
    attack: attack / 120,
    yw,
    aw
  };
};

/**
 * Even-strength possession (`tvtilanne:` GOSUB at [ILEX5.BAS:3978-3996]).
 * Both sides get a chance per call. Returns the goal deltas.
 *
 * Two-stage roll per side `b` (other side = `c`):
 *   1. attack(b) * R > defence(c) * R         — beat the defence
 *   2. attack(b) * R > goalie(c) + defence(c)/3   — beat the goalie
 *
 * Both must pass for a goal. RND is fresh on every operand — the QB
 * call sites use four independent `RND`s per attempt.
 *
 * The `gnome` / `jaynax(2)` shenanigans collapse to "always attempt"
 * for two clean AI teams.
 */
const evenStrengthPossession = (
  home: SideStrength,
  away: SideStrength,
  random: RandomService
): { home: number; away: number } => {
  const tally = { home: 0, away: 0 };
  const sides: Array<["home", SideStrength, SideStrength]> = [
    ["home", home, away],
    ["away" as "home", away, home] // QB iterates b=1,c=2 then b=2,c=1
  ];
  for (const [key, b, c] of sides) {
    if (b.attack * rnd(random) > c.defence * rnd(random)) {
      if (b.attack * rnd(random) > c.goalie * rnd(random) + c.defence / 3) {
        tally[key] += 1;
      }
    }
  }
  return tally;
};

/**
 * Power-play possession (`yvtilanne:` GOSUB at [ILEX5.BAS:3999-4014]).
 * Only the side with the man advantage (`b = voimalla`) attempts.
 *
 * Two-stage roll:
 *   1. yw(b) * R > aw(c) * R                       — beat the PK unit
 *   2. yw(b) * R > goalie(c)*15 + goalie(c)*30 * R — beat the goalie
 *
 * Note the asymmetry: PP shots face a *much* tougher goalie check
 * (constants 15 + 30R vs the +defence/3 offset at even strength).
 */
const powerPlayPossession = (
  attacker: SideStrength,
  defender: SideStrength,
  random: RandomService
): number => {
  if (attacker.yw * rnd(random) > defender.aw * rnd(random)) {
    if (
      attacker.yw * rnd(random) >
      defender.goalie * 15 + defender.goalie * 30 * rnd(random)
    ) {
      return 1;
    }
  }
  return 0;
};

/**
 * Single sudden-death overtime attempt — used for cup / playoff ties.
 * Mirrors the `CASE 2` branch of the `jatkoaika:` GOSUB at
 * [ILEX5.BAS:3963-3975]. Returns "home" / "away" / null.
 *
 * Identical roll shape to even-strength but the formula iterates both
 * sides per loop and returns the first scorer.
 */
const overtimeAttempt = (
  home: SideStrength,
  away: SideStrength,
  random: RandomService
): "home" | "away" | null => {
  const sides: Array<["home" | "away", SideStrength, SideStrength]> = [
    ["home", home, away],
    ["away", away, home]
  ];
  for (const [key, b, c] of sides) {
    if (b.attack * rnd(random) > c.defence * rnd(random)) {
      if (b.attack * rnd(random) > c.goalie * rnd(random) + c.defence / 3) {
        return key;
      }
    }
  }
  return null;
};

// ─── public API ──────────────────────────────────────────────────────

/**
 * Simulate a single match between two AI-controlled base teams.
 *
 * Pure function modulo the RandomService. Faithful port of `SUB ottpel`
 * for the AI-vs-AI sub-case; see the module docstring for the long
 * list of TODOs that need decoded inputs before the human-managed and
 * light-team cases come online.
 */
export const simulateAiMatch = (
  home: AiMatchTeam,
  away: AiMatchTeam,
  round: AiMatchRound,
  random: RandomService = defaultRandom
): AiMatchResult => {
  // 1. Round-type baseline etu, then morale tweak per side.
  //    QB: SELECT CASE kiero(kr) [3711], then mo(...) tweak [3771-3772].
  const etuBase = computeEtu(round);
  const etuHome = applyMoraleEtu(etuBase.home, home.morale);
  const etuAway = applyMoraleEtu(etuBase.away, away.morale);

  // TODO: league comeback handicap [ILEX5.BAS:3754-3762] — needs
  // standings position `s(team)` and season match counter `ot`. Skip.

  // 2. Per-side strength tuple (ode + yw + aw), all post-multipliers.
  const homeSide = prepareSide(home, etuHome);
  const awaySide = prepareSide(away, etuAway);

  // 3. 15 possessions. Each rolls voimalla = INT(10*RND)+1; if > 2 then
  //    even-strength, else side `voimalla` gets a power-play shot.
  //    QB: FOR xx = 1 TO 15 [3919-3923].
  let homeGoals = 0;
  let awayGoals = 0;
  for (let i = 0; i < 15; i += 1) {
    const voimalla = random.integer(1, 10);
    if (voimalla > 2) {
      const delta = evenStrengthPossession(homeSide, awaySide, random);
      homeGoals += delta.home;
      awayGoals += delta.away;
    } else if (voimalla === 1) {
      // Home power play.
      homeGoals += powerPlayPossession(homeSide, awaySide, random);
    } else {
      // voimalla === 2: away power play.
      awayGoals += powerPlayPossession(awaySide, homeSide, random);
    }
  }

  // 4. Overtime if tied. Regular / EHL → single one-round attempt
  //    (`gnome = 1` branch). Cup / playoff → sudden death (`gnome = 2`).
  //    QB: SELECT CASE kiero(kr) [3936-3950] + jatkoaika: [3961-3975].
  let overtime = false;
  if (homeGoals === awayGoals) {
    overtime = true;
    const isSuddenDeath =
      round.type === 3 ||
      round.type === 42 ||
      round.type === 44 ||
      round.type === 46;
    if (isSuddenDeath) {
      // Loop forever until someone scores. ode values are strictly
      // positive (mw/pw/hw rolls + multipliers) so this terminates
      // with probability 1 — same guarantee the QB code relies on.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const scorer = overtimeAttempt(homeSide, awaySide, random);
        if (scorer === "home") {
          homeGoals += 1;
          break;
        }
        if (scorer === "away") {
          awayGoals += 1;
          break;
        }
      }
    } else {
      // Single one-round attempt. May still end in a tie — the QB
      // code accepts that and the tie stands (regular-season OT
      // ties were a thing in the late-90s SM-liiga before shootouts).
      const scorer = overtimeAttempt(homeSide, awaySide, random);
      if (scorer === "home") homeGoals += 1;
      else if (scorer === "away") awayGoals += 1;
    }
  }

  // 5. Morale deltas. QB `morttivertti:` [3953-3960]:
  //      winner: mor team, +1
  //      loser:  mor team, -1
  //    `mor` clamps to [-10, +10] but that's the caller's job here.
  //    TODO: tournament matches (turnauz <> 0) skip this; out of scope
  //          for this isolated function.
  let homeMoraleChange = 0;
  let awayMoraleChange = 0;
  if (homeGoals > awayGoals) {
    homeMoraleChange = 1;
    awayMoraleChange = -1;
  } else if (awayGoals > homeGoals) {
    homeMoraleChange = -1;
    awayMoraleChange = 1;
  }

  return {
    homeGoals,
    awayGoals,
    overtime,
    homeMoraleChange,
    awayMoraleChange
  };
};
