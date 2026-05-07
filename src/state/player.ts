import type { CountryIso } from "@/data/countries";
import type { PlayerSpecialtyKey } from "@/data/player-specialties";

/**
 * Slim view of a player on a "light" team (QB ids ≥ 49 — NHL,
 * European, amateur). The QB original stores the full `pelaaja`
 * struct for these too, but only `nam` / `psk` / `nat` / `age` are
 * ever read — match simulation for light teams uses the coarse
 * `hw/pw / 3.3 / 2.5 / 4.4` formula at ILEX5.BAS:332-333 with no
 * manager mults, no morale, no contracts, no specialties.
 */
export type LightPlayer = {
  id: string;
  initial: string;
  surname: string;
  position: Player["position"];
  nationality: CountryIso;
  skill: number;
  age: number;
};

/**
 * Standard player contract.
 *
 * Maps to QB `pel.svu` (years) + `pel.sra` (salary) + `pel.nhl`
 * (clause). The QB `nhl` int packs three live states into one
 * field; we split them into a discriminated `specialClause`.
 *
 * QB → TS clause mapping:
 * - `nhl = 0`  → `specialClause` undefined (default; cheapest baseline)
 * - `nhl = -2` → `{ kind: "nhl", freshlySigned: true }` (year 1)
 * - `nhl = -1` → `{ kind: "nhl", freshlySigned: false }` (matured;
 *               required for `plannedDeparture: "nhl"` to fire)
 * - `nhl = 1`  → `{ kind: "free-fire" }` (VAPAAPOTKU — manager can
 *               terminate any time; players hate it, salary balloons)
 * - `nhl = 2`  → **DEAD CODE in QB** ("+1" extension); never reached
 *               by the UI's `optio(1) ∈ 0..2` cap. Not modelled.
 *
 * End-of-season maturation (ILEX5.BAS:7222): `freshlySigned: true →
 * false` after one season. Auto-cleared if `nhl=-2 AND svu=1` at
 * sign time (ILEX5.BAS:6558) — a one-year contract can't carry an
 * NHL clause.
 */
export type RegularContract = {
  type: "regular";
  /** QB `svu` — sopimusvuodet, contract years remaining. */
  duration: number;
  /** QB `sra` — sopimusraha, salary per round. */
  salary: number;
  specialClause?:
    | { kind: "nhl"; freshlySigned: boolean }
    | { kind: "free-fire" };
};

/**
 * Sentinel guest-player contract (Läski-Salonen-style narrative
 * cameos). Maps to QB `svu = 666` (one-off temp) and `svu = 10000`
 * (longer guest stint); both auto-released after `duration` turns.
 * The actual sentinel value lived in QB's `svu`; we hoist it into a
 * variant rather than overload `duration`.
 */
export type GuestContract = {
  type: "guest";
  duration: number;
};

export type Contract = RegularContract | GuestContract;

/**
 * Transient performance modifier — QB `pel.plus` (signed) +
 * `pel.kest` (countdown). Sources: mood-event swings
 * (ILEX5.BAS:1276), morale events (:3270, :3275), contract-signing
 * high (`plus=1, kest=1000` happy / `plus=-2, kest=1000` forced
 * re-sign at :5894).
 *
 * QB stored a single slot (`plus`/`kest`) per player; we allow the
 * array to grow. Stack semantics are not enforced by the type —
 * keep the QB convention of "don't add a `skill` modifier if the
 * player already has one" at the call site.
 *
 * Auto-cleared when `duration` decrements to 0 (ILEX5.BAS:1842-1843).
 */
type PerformanceModifier = {
  type: "skill";
  duration: number;
  amount: number;
};

/**
 * Real injury — QB `pel.inj` in 1..999 (or 2001..2999 for the
 * variant branch we haven't fully decoded). Forces `kun -= 2` per
 * turn while active (ILEX5.BAS:1822). Set by post-match jäynä
 * rolls (:5634-5640) and crisis-meeting saunailta beatdowns
 * (:2858-2864). Auto-injury at `kun < -6` triggers a 3..5 turn one
 * (:1845-1849).
 */
type Injury = {
  type: "injury";
  duration: number;
};

/**
 * LAKKO — QB `pel.inj = 3333`. Player on strike, refusing to play
 * during financial crisis. Triggered in `faarao` SUB
 * (ILEX5.BAS:1450-1465): per non-injured non-zombie player, roll
 * `200*RND < ego * (konkurssi - 1)`; failures strike. Auto-clears
 * (ILEX5.BAS:255) when `konkurssi(pv) = 0` — i.e. when the team
 * stops being broke. No countdown on the player itself; cleared by
 * team financial recovery.
 */
type Strike = {
  type: "strike";
};

/**
 * Disciplinary suspension. Not yet decoded — placeholder for QB
 * suspension flows (likely `inj` in 2001..2999 range or via tag).
 * TODO: confirm against QB once we port the discipline events.
 */
type Suspension = {
  type: "suspension";
  duration: number;
};

/**
 * National-team absence. QB `pel.inj = 9001` (one-round break-time
 * absence) or `9002` (B-tier mid-season tournament). Auto-clears
 * at ILEX5.BAS:1825-1828 (`inj=9001` → cleared next turn with
 * `kun -= 2`) or via `mmkisaloppu` (`inj=9002` cleared with
 * `kun -= 3`).
 */
type NationalTeamAbsence = {
  type: "nationals";
  duration: number;
};

type PlayerEffect =
  | PerformanceModifier
  | Injury
  | Suspension
  | NationalTeamAbsence
  | Strike;

/**
 * Persistent state flags with no countdown. Keep `:` namespacing
 * convention; new ones will accumulate as events port.
 *
 * - `muilutus:primed` — QB `pel.spe = 666` overlay on enforcer (5).
 *   Signals "this enforcer will muilutta the next opponent". Only
 *   valid alongside `specialty = "enforcer"`.
 * - `zombified` — QB `pel.spe >= 30000` overlay. Floors `yvo/avo`
 *   to −3 and `ldr` to 1 (ILEX5.BAS:266-268); per-turn luck roll
 *   either clears or perma-zombifies (handled at team scope).
 * - `national-team:selected` — QB `pel.mjo = 1`. Selected to the
 *   national team. Drives the `inj=9001/9002` absences during break
 *   rounds (`maajoukkue` SUB at ILEX5.BAS:3119-3151).
 */
type Tag = "muilutus:primed" | "zombified" | "national-team:selected";

/**
 * The central player record. Direct port of QB `TYPE pelaaja`
 * (MHM2K.BI:31-58) with three deliberate departures:
 *
 * 1. **Sentinel-encoded fields are unpacked.** QB packs orthogonal
 *    state into `spe` (666 / ≥30000), `inj` (3333 / 9001 / 9002),
 *    `nhl` (-2 / -1 / 1 / 2), and `svu` (666 / 10000) using
 *    sentinel integers. We split these into proper variants:
 *    `tags`, `effects`, `Contract` discriminated union,
 *    `specialClause.freshlySigned`.
 * 2. **`plus` + `kest` become an `effects` array.** The QB single
 *    slot was a memory constraint, not design.
 * 3. **`lah` becomes optional `plannedDeparture`.** QB used `0` as
 *    "staying"; absence is more idiomatic in TS.
 *
 * Things that DON'T port:
 * - Separate "career total" stats — players don't carry over
 *   between teams in MHM 2000; transfers rebuild the record. So
 *   `stats.total` IS QB `pok` (lifetime-with-this-team) and there
 *   is no career layer because there is no career.
 * - `nhl = 2` ("+1" locked extension) — dead code in QB; the UI
 *   caps `optio(1) ∈ 0..2` so the trailing `ELSE nhl = 2` branch
 *   is unreachable. Three clause states, not four.
 * - `neu` (negotiation lockout) — per-turn boolean, reset every
 *   gameday-start. Belongs at team / negotiation-flow scope.
 * - `ket` (line/chain assignment) — belongs to per-team lineup
 *   state, not the player.
 *
 * See [VARIABLES.md → `pelaaja`](../mhm2000-qb/_NOTES/VARIABLES.md)
 * for the full per-field decoder.
 */
export type BasePlayer = {
  id: string;

  /** First initial only — QB packs `nam STRING*13` as one field. */
  initial: string;
  surname: string;

  /** See {@link PlayerEffect}. Replaces QB `inj` + `plus`/`kest`. */
  effects: PlayerEffect[];

  /** See {@link Tag}. Replaces QB sentinel overlays on `spe` + `mjo`. */
  tags: Tag[];

  /** QB `ppp`: 1=g, 2=d, 3=lw, 4=c, 5=rw. QB doesn't split L/R defence. */
  position: "g" | "d" | "lw" | "c" | "rw";

  /** QB `nat`. */
  nationality: CountryIso;

  /** QB `psk` — pelisilmä, range 1..20. Base skill rating. */
  skill: number;

  /**
   * QB `age`. Drives `kuntomax(MIN(age, 33))` stamina ceiling,
   * captain selection score `(age + ldr^1.3) / 50`, salary curve,
   * retirement, NHL departure eligibility (age < 27/26 gates),
   * goals-per-game normalisation. Incremented at season rollover.
   */
  age: number;

  /**
   * QB `yvo` — ylivoima, range −3..+3. Power-play modifier.
   * Effective PP rating = `skill + powerplayMod + plus`
   * (ILEX5.BAS:909-910). Floored to −3 by zombification.
   */
  powerplayMod: number;

  /**
   * QB `avo` — alivoima, range −3..+3. Penalty-kill modifier.
   * Effective PK rating = `skill + penaltyKillMod + plus`
   * (ILEX5.BAS:913-914). Floored to −3 by zombification.
   */
  penaltyKillMod: number;

  /**
   * QB `ego`. Neutral 10. Generally a debuff — no known positive
   * effect. Drives salary inflation (+1% per point above 10), event
   * eligibility (`fat 5/6/7/8` filters), `faarao` strike rolls,
   * crisis-meeting trouble (`al 6` / `al 7`), and the sauna-evening
   * beatdown chain. See VARIABLES.md for the full effect chain.
   */
  ego: number;

  /**
   * QB `ldr` — johtajuus. Neutral 6. Drives captain selection
   * (`(age + ldr^1.3) / 50`), crisis-meeting outcomes (captain's
   * leadership is the success base), and salary
   * (`*= 1 + (-6 + ldr) * johlisa`). Floored to 1 by zombification.
   */
  leadership: number;

  /** QB `kar`. Neutral 10. Bell-curve roll from KEISIT.M2K col 6. */
  charisma: number;

  /**
   * QB `spe` (records 41..54 in Y.MHM, values 1..13). Mutually
   * exclusive — at most one base specialty per player. Sentinel
   * overlays (`spe = 666`, `spe >= 30000`) live in {@link tags}.
   */
  specialty: PlayerSpecialtyKey | null;

  /**
   * QB `kun` — kunto, signed fatigue. Capped above by
   * `kuntomax(MIN(age, 33))`. Per-turn movement: rest +2, light
   * play +1, hard play −2, multi-line stack −1. `kun < -6` (and
   * not injured) triggers a 3..5 turn auto-injury. Forced 0 for
   * `zombified` players. Reset to 0 at season rollover.
   */
  condition: number;

  stats: {
    /**
     * QB `pot` games + `gls` / `ass`. Reset at season rollover
     * (ILEX5.BAS:7741-7742).
     */
    season: {
      games: number;
      goals: number;
      assists: number;
    };
    /**
     * QB `pok` games (and TS-side goals/assists totals). Reset to 0
     * on transfer (ILEX5.BAS:3656, 4857, 7679). In MHM 2000 players
     * don't carry over between teams — the record is rebuilt — so
     * this is the player's lifetime stat *with this team*. There is
     * no "career total" because there is no career. Gates specialty
     * info reveal at `games > 30` (ILEX5.BAS:5157) and feeds the
     * `uglyAndWeird → fbimiehet` event probability (:278).
     * Goals/assists totals are TS-side additions (QB only stored
     * `pok` game count).
     */
    total: {
      games: number;
      goals: number;
      assists: number;
    };
  };
};

export type HiredPlayer = BasePlayer & {
  type: "hired";
  contract: Contract;
  /**
   * QB `lah` — set during `suunnitelma` (end-of-season planning,
   * ILEX5.BAS:7170-7211); fires at ILEZ5.BAS:183-220 once `svu = 0`.
   * Undefined = staying (QB `lah = 0`).
   *
   * - `cut` — QB `lah = 96`. Manager flagged for release.
   * - `nhl` — QB `lah = 97`. Wants NHL move; **only fires when
   *   `specialClause.kind === "nhl" && !freshlySigned`** (matured).
   * - `foreign-return` — QB `lah = 98`. Foreign player going home.
   * - `retirement` — QB `lah = 99`.
   */
  plannedDeparture?: "cut" | "nhl" | "foreign-return" | "retirement";
};

/**
 * A player on the free-agent market (`bel()` in QB).
 *
 * Copied from `pel()` with `pok = 0` (total stats reset) and `neu`
 * toggled. No active contract exists — `sra` in QB becomes the
 * negotiation starting point (`askingSalary`) fed into `sopimusext`.
 * `plannedDeparture` is also meaningless outside a live contract.
 */
export type MarketPlayer = BasePlayer & {
  type: "market";

  /** QB `pel.sra` — asking salary, basis for contract negotiation. */
  askingSalary: number;
};

export type Player = HiredPlayer | MarketPlayer;
