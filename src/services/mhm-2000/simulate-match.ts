/**
 * MHM 2000 — isolated match simulator.
 *
 * Faithful port of `SUB ottpel` ([ILEX5.BAS:3709-4017](../../mhm2000-qb/ILEX5.BAS)),
 * accepting both human- and AI-managed base teams. Per-side strength
 * comes from `calculateStrength(team)` ([../team.ts](../team.ts)),
 * which already discriminates AI (TASOT.M2K-derived `strengthObj`) from
 * human (roster-derived) — so this engine doesn't need to care.
 *
 * This is the smallest end-to-end vertical slice of the simulation: in →
 * two sides + a round type, out → a final score. The function is pure
 * (modulo the injected Random).
 *
 * QB context recap (read these notes BEFORE editing):
 *
 *   - `od(1)` = home team id, `od(2)` = away team id.
 *   - `mw(team)` / `pw(team)` / `hw(team)` = goalie / defence / attack
 *     base figures. AI base teams: set once per season at `tasomaar`
 *     from TASOT.M2K `lvl(tazo).maz / .puz / .hyz` plus per-match
 *     noise (±1 / ±2 / ±4). Human teams: computed from the actual
 *     roster (QB `orgamaar`). Both flows feed the same triple — the
 *     engine consumes whichever the team-strength service returns.
 *   - `yw(team)` / `aw(team)` = power-play / penalty-kill weights.
 *     For managed base teams (both AI and human) these are computed
 *     by the per-round shadow at
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
 *
 * What this function intentionally does NOT model (yet) — every one of
 * these gets a TODO at its call site below:
 *
 *   - Light teams (`od(z) >= 49` — TEAMS.NHL / FOR / ALA): they take a
 *     simpler path in QB (no `specialTeams` multiplier, no roster
 *     scan, no `tre`/`tautip`). Collapsed via proxy defaults: Pasolini
 *     proxy manager (zero attributes), proxy service levels per origin
 *     (travel 4 for foreign/NHL, 0 for amateur; all others 0).
 *   - `tre(team)` readiness multiplier — ✅ wired to `team.readiness`
 *     (season-arc multiplier ~0.7..1.3, see strategies.ts).
 *   - `tautip(team)` epidemic multiplier — TODO; assume 1.0.
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
 *     stats is non-positive after multipliers, which can't happen
 *     here yet (mw/pw/hw are always >= 0 and the multipliers we apply
 *     are >= 0.7).
 */

import competitions from "@/data/competitions";
import type { EventEffect } from "@/game/event-effects";
import competitionTypes from "@/services/competition-type";
import defaultRandom from "@/services/random";
import { calculateAw, calculateStrength, calculateYw } from "@/services/team";
import type { Manager, Team } from "@/state/game";
import type {
  Competition,
  GameResult,
  Group,
  HomeAndAwayTeamAdvantages,
  Phase
} from "@/types/competitions";
import type { Random } from "random-js";

/**
 * One side of the match — a Team (AI or human) plus the Manager that
 * controls it.
 *
 * The match engine reads three things:
 *
 *   - `calculateStrength(team)` — yields the `{ goalie, defence,
 *     attack }` triple, the QB `mw / pw / hw`. AI teams read this
 *     directly from `team.strengthObj` (TASOT.M2K-derived); human
 *     teams compute it from the roster. The discrimination lives in
 *     [../team.ts](../team.ts) — this engine just calls and consumes.
 *   - `team.morale` — QB `mo(team)`, clamped to -10..+10 elsewhere.
 *   - `manager.attributes.specialTeams` — QB `mtaito(2, man(team))`,
 *     range -3..+3. Multiplier on PP/PK weights:
 *     `yw *= 1 + 0.04 * specialTeams` (and same for `aw`). Per-team
 *     stat in QB; per-manager in TS, dereferenced on call.
 *
 *     Only applied for managed base teams (`od(z) < 49`); light teams
 *     (NHL / foreign / amateur, `od(z) >= 49`) skip it — see the
 *     SELECT CASE at [ILEX5.BAS:326-334](../../mhm2000-qb/ILEX5.BAS).
 *     Light-team support is TODO; for now both sides are assumed to
 *     be managed base teams.
 */
export type MatchSide = {
  team: Team;
  manager: Manager;
};

export type Overtime = "none" | "regular" | "sudden-death";

export type Intensity = 0 | 1 | 2;

export type MatchResult = {
  /** Final score. */
  homeGoals: number;
  awayGoals: number;
  /** True iff overtime was needed to break a tie. */
  overtime: boolean;
  /**
   * Effective intensity per side. Equals `team.intensity` for league/
   * cup/playoff, forced to 1 (normaali) for tournament/practice.
   * The caller uses this to apply post-match fatigue (`kun`) deltas.
   */
  homeIntensity: Intensity;
  awayIntensity: Intensity;
  /**
   * Morale deltas to apply post-match (winner +1 / loser -1, no change
   * on a tie). Mirrors the `morttivertti:` block at
   * [ILEX5.BAS:3953-3960]. Tournament matches (`turnauz <> 0`) skip
   * this — out of scope for this function.
   */
  effects: EventEffect[];
};

// ─── helpers ─────────────────────────────────────────────────────────

/**
 * QB `RND` — uniform real in `[0, 1)`. Aliased for readability so the
 * port reads visibly close to the QB original.
 */
const rnd = (random: Random): number => random.real(0, 1);

/**
 * Compute the home/away `etu` (advantage) baseline for a round.
 *
 * Mirrors the SELECT CASE at [ILEX5.BAS:3711-3749]. Returns the
 * competition-defined baseline before team-specific modifiers
 * (morale, intensity, services) are layered on.
 */
const computeEtu = (context: MatchContext): HomeAndAwayTeamAdvantages => {
  const def = competitions[context.competition.id];
  return def.homeAndAwayTeamAdvantages(context.competition.phase);
};

/**
 * Apply the morale tweak to `etu`, matching [ILEX5.BAS:3771-3772]:
 *   IF mo < 0 THEN etu += mo / 125
 *   ELSE IF mo > 0 THEN etu += mo / 155
 */
const applyMoraleEtu = (etu: number, morale: number): number => {
  if (morale < 0) {
    return etu + morale / 125;
  }
  if (morale > 0) {
    return etu + morale / 155;
  }
  return etu;
};

/**
 * Resolve the effective intensity for a side. The team's own
 * `intensity` is used in league / cup / playoff matches;
 * tournament and practice matches force normaali (1).
 *
 * QB guard: `kiero(kr) <> 4 AND turnauz = 0`.
 */
const effectiveIntensity = (
  intensity: Intensity,
  phaseType: Phase["type"]
): Intensity => {
  if (phaseType === "tournament" || phaseType === "independent-games") {
    return 1;
  }
  return intensity;
};

/**
 * Apply the intensity tweak to `etu`, matching [ILEX5.BAS:3778-3780]:
 *   IF inte(zz) = 0 THEN etu -= 0.15   (LAISKA)
 *   IF inte(zz) = 2 THEN etu += 0.10   (HURJA)
 */
const applyIntensityEtu = (etu: number, intensity: Intensity): number => {
  if (intensity === 0) {
    return etu - 0.15;
  }
  if (intensity === 2) {
    return etu + 0.1;
  }
  return etu;
};

/**
 * Apply the fan group `etu` bonus, matching [ILEX5.BAS:3717-3719]:
 *   IF erik(1, od(z)) >= z THEN etu(z) = etu(z) + .02
 *
 * z=1 (home): level >= 1 (kotiottelut) → +0.02
 * z=2 (away): level >= 2 (kaikki ottelut) → +0.02
 *
 * Gated by `doesTravelApply` (same competitions as travel — not
 * practice, not tournaments). With proxy values (light teams have 0),
 * the QB `od(z) < 49` guard collapses.
 */
const applyFanGroupEtu = (
  etu: number,
  fanGroupLevel: number,
  isHome: boolean
): number => {
  const threshold = isHome ? 1 : 2;
  if (fanGroupLevel >= threshold) {
    return etu + 0.02;
  }
  return etu;
};

/**
 * Apply the travel `etu` bonus for the away team, matching
 * [ILEX5.BAS:3715]: `etu(2) = etu(2) + .02 * erik(4, od(2))`.
 *
 * Only called for the away side. Gated by `doesTravelApply`.
 */
const applyTravelEtu = (etu: number, travelLevel: number): number => {
  return etu + 0.02 * travelLevel;
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
 * Mirrors lines [ILEX5.BAS:3764-3879]. Doping (`erik(3)`) is handled
 * upstream in `calculateStrength` / `calculateYw` / `calculateAw`
 * (AI path) or per-player in the roster calculation (human path).
 */
const prepareSide = (side: MatchSide, etu: number): SideStrength => {
  // Pre-multiplier raw stats. QB:
  //   ode(1, z) = mw(od(z))
  //   ode(2, z) = pw(od(z))
  //   ode(3, z) = hw(od(z))
  // TODO: add `tauti(1..3, tox(team))` epidemic mods once we model
  //       per-team illness. For now these are 0.

  const strength = calculateStrength(side.team);

  let { goalie, defence, attack } = strength;

  // QB shadow at [ILEX5.BAS:328-329] — yw/aw now computed centrally
  // in team.ts (calculateYw / calculateAw), including the manager's
  // specialTeams multiplier. Doping (erik(3)) is folded into the AI
  // path there; human teams apply doping per-player in the roster
  // calculation.
  // TODO: fold in `tauti(2)` / `tauti(3)` epidemic mods once modelled.
  let yw = calculateYw(side.team, side.manager);
  let aw = calculateAw(side.team, side.manager);

  // QB lines 3844-3851: tautip and tre multipliers for od(z) < 49.
  // TODO: model `tautip(team)` (epidemic). Defaults to 1.0.
  const tautip = 1.0;
  // `tre(team)` = team.readiness — season-arc multiplier (~0.7..1.3),
  // ported in strategies.ts, drifts per regular-season gameday.
  const tre = side.team.readiness;
  yw *= tautip * tre;
  aw *= tautip * tre;

  // Final etu scale of yw/aw (QB lines 3850-3851).
  yw *= etu;
  aw *= etu;

  // ode floors and final etu/tautip/tre scaling (QB lines 3853-3870).
  // The "ode <= 0 → forced 12-0" branch is unreachable in the
  // managed-base-team case; we don't replicate it (TODO if/when
  // light teams or zeroing pranks come online).
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
 * here — pranks are not modelled yet (TODO).
 */
const evenStrengthPossession = (
  home: SideStrength,
  away: SideStrength,
  random: Random
): { home: number; away: number } => {
  const tally = { home: 0, away: 0 };
  const sides = [
    ["home", home, away] as const,
    ["away", away, home] as const // QB iterates b=1,c=2 then b=2,c=1
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
  random: Random
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
  random: Random
): "home" | "away" | null => {
  const sides = [["home", home, away] as const, ["away", away, home] as const];
  for (const [key, b, c] of sides) {
    if (b.attack * rnd(random) > c.defence * rnd(random)) {
      if (b.attack * rnd(random) > c.goalie * rnd(random) + c.defence / 3) {
        return key;
      }
    }
  }
  return null;
};

export type MatchContext = {
  competition: Competition;
  phase: Phase;
  group: Group;
  round: number;
  matchup: number;
};

// ─── public API ──────────────────────────────────────────────────────

/**
 * Simulate a single match between two managed base teams (AI or
 * human; the engine is symmetric over the two).
 *
 * Pure function modulo the Random. Faithful port of `SUB ottpel`
 * for the managed-base-team sub-case; see the module docstring for
 * the list of TODOs that need decoded inputs before light-team
 * matches and the human-only mechanics (services, consumables,
 * pranks) come online.
 */
export const simulateMatch = (
  home: MatchSide,
  away: MatchSide,
  context: MatchContext,
  random: Random = defaultRandom
): MatchResult => {
  const { phase, group, round, matchup } = context;

  // 1. Round-type baseline etu, then morale tweak per side.
  //    QB: SELECT CASE kiero(kr) [3711], then mo(...) tweak [3771-3772].
  const etuBase = computeEtu(context);
  let etuHome = applyMoraleEtu(etuBase.home, home.team.morale);
  let etuAway = applyMoraleEtu(etuBase.away, away.team.morale);

  // Intensity modifier. QB [ILEX5.BAS:3778-3780].
  const homeEffIntensity = effectiveIntensity(home.team.intensity, phase.type);
  const awayEffIntensity = effectiveIntensity(away.team.intensity, phase.type);
  etuHome = applyIntensityEtu(etuHome, homeEffIntensity);
  etuAway = applyIntensityEtu(etuAway, awayEffIntensity);

  // Service-derived etu modifiers. QB [ILEX5.BAS:3715-3739].
  // Gated by doesTravelApply — same competitions gate as the QB
  // SELECT CASE (not practice, not tournaments).
  const def = competitions[context.competition.id];
  if (def.doesTravelApply(context.competition.phase)) {
    // erik(1) — fan group: +0.02 if level >= threshold (1 home, 2 away)
    etuHome = applyFanGroupEtu(etuHome, home.team.services.fanGroup, true);
    etuAway = applyFanGroupEtu(etuAway, away.team.services.fanGroup, false);
    // erik(4) — travel: away team only, +0.02 per level
    etuAway = applyTravelEtu(etuAway, away.team.services.travel);
  }

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

  const result: GameResult = {
    home: homeGoals,
    away: awayGoals,
    overtime: false
  };

  // 4. Overtime if tied. Regular / EHL → single one-round attempt
  //    (`gnome = 1` branch). Cup / playoff → sudden death (`gnome = 2`).
  //    QB: SELECT CASE kiero(kr) [3936-3950] + jatkoaika: [3961-3975].
  //    Per-competition dispatch lives in `competition-type.ts`.
  const type = competitionTypes[phase.type];
  const overtime = type.overtime(result, group, round, matchup);

  if (overtime !== "none") {
    const isSuddenDeath = overtime === "sudden-death";

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
      if (scorer === "home") {
        homeGoals += 1;
      } else if (scorer === "away") {
        awayGoals += 1;
      }
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
    overtime: overtime !== "none",
    homeIntensity: homeEffIntensity,
    awayIntensity: awayEffIntensity,
    effects: [
      { type: "incrementMorale", team: home.team.id, amount: homeMoraleChange },
      { type: "incrementMorale", team: away.team.id, amount: awayMoraleChange }
    ]
  };
};
