/**
 * Player specialties (the QB `pelaaja.spe` field).
 *
 * Decoded from `src/mhm2000-qb/DATA/Y.MHM` records 41..61 — `lay 41 +
 * neup.spe` in `ILEX5.BAS:5157` is what the player-info screen prints
 * once the manager has known the player long enough (`pok > 30`, see
 * `pelaaja.pok`).
 *
 * The file Y.MHM is a 500-byte fixed-width random-access record file
 * (cp850). Records 41..54 hold real specialty labels; 55..61 are
 * placeholder strings ("Erikoisuus 14"…"erikoisuus 20") MikroBitti
 * reserved but never used. We model only the canonical 0..13 range.
 *
 * `spe` also hosts a couple of **sentinel** values that are NOT in the
 * label table — `666` and `>= 30000`. Those are tracked as named
 * constants below; never put them in the regular enum.
 */

/**
 * The 13 named specialties. `none` is `spe = 0` (no specialty / clean
 * record). String keys are descriptive English; preserve the Finnish
 * `displayName` verbatim — these strings are the soul of the game.
 */
export type PlayerSpecialtyKey =
  | "none"
  | "evangelist"
  | "foulMouth"
  | "uglyAndWeird"
  | "extremelyFat"
  | "enforcer"
  | "samba"
  | "haminator"
  | "greedySurfer"
  | "moody"
  | "daddyPays"
  | "magicalRadarPair"
  | "agitator"
  | "zombie";

/**
 * Map from QB's `spe` integer to our string key.
 *
 * Index 0 is `none` (no specialty). Keep order STABLE — QB sites
 * compare against literal values (`spe = 3`, `spe = 5`, `spe = 13`,
 * etc.), and the Y.MHM record offsets depend on it.
 */
export const playerSpecialtyByLegacyIndex = [
  "none", // 0
  "evangelist", // 1 — VALAA USKOA MUIHIN
  "foulMouth", // 2 — RUMAN KIELENKÄYTÖN MESTARI
  "uglyAndWeird", // 3 — RUMA JA OUTO MIES (triggers `fbimiehet` after enough games)
  "extremelyFat", // 4 — ÄÄRIMMÄISEN LIHAVA
  "enforcer", // 5 — POLIISI (lit. "police" — an on-ice goon. Manager can order them via the `m` key to *muiluttaa* (rough up) the next opponent's players; flagged as `spe = 666` until the match resolves; risks a ban.)
  "samba", // 6 — SAMBA SOI!
  "haminator", // 7 — HAMINAATOR
  "greedySurfer", // 8 — RAHANAHNE SURFFAAJA
  "moody", // 9 — AILAHTELEVAINEN
  "daddyPays", // 10 — ISI MAKSAA JOS PELAA (pays manager 10000 per played game)
  "magicalRadarPair", // 11 — KUULUU MAAGISEEN TUTKAPARIIN
  "agitator", // 12 — AGITAATTORI
  "zombie" // 13 — ZOMBI (career-ending, attributes floored, kun forced to 0)
] as const satisfies readonly PlayerSpecialtyKey[];

/** Inverse of `playerSpecialtyByLegacyIndex` — for nicer call sites. */
export const legacyIndexByPlayerSpecialty = {
  none: 0,
  evangelist: 1,
  foulMouth: 2,
  uglyAndWeird: 3,
  extremelyFat: 4,
  enforcer: 5,
  samba: 6,
  haminator: 7,
  greedySurfer: 8,
  moody: 9,
  daddyPays: 10,
  magicalRadarPair: 11,
  agitator: 12,
  zombie: 13
} as const satisfies Record<PlayerSpecialtyKey, number>;

/**
 * Verbatim Finnish display strings from Y.MHM records 41..54. These
 * are what the player-info screen prints — preserve exactly.
 */
export const playerSpecialtyDisplayNames = {
  none: "",
  evangelist: "VALAA USKOA MUIHIN",
  foulMouth: "RUMAN KIELENKÄYTÖN MESTARI",
  uglyAndWeird: "RUMA JA OUTO MIES",
  extremelyFat: "ÄÄRIMMÄISEN LIHAVA",
  enforcer: "POLIISI",
  samba: "SAMBA SOI!",
  haminator: "HAMINAATOR",
  greedySurfer: "RAHANAHNE SURFFAAJA",
  moody: "AILAHTELEVAINEN",
  daddyPays: "ISI MAKSAA JOS PELAA",
  magicalRadarPair: "KUULUU MAAGISEEN TUTKAPARIIN",
  agitator: "AGITAATTORI",
  zombie: "ZOMBI"
} as const satisfies Record<PlayerSpecialtyKey, string>;

/**
 * Sentinel `spe` values that live OUTSIDE the 0..13 enum.
 *
 * - `muilutusOrdered` (666) — an `enforcer` (spe=5) that the manager
 *   has ordered to *muiluttaa* (rough up) the opposition in the next
 *   match. Toggled via the `m` key on the player-info screen
 *   (`ILEX5.BAS:2463-2464`). When set, `jaynacheck` flags
 *   `jaynax(5, pv) = 1` ahead of the next match (`ILEX5.BAS:2182`),
 *   which is what actually executes the assault — and risks a ban.
 *   Auto-reverts to `enforcer` if the player loses their line
 *   assignment (`ket = 0` → `spe = 5` at `ILEX5.BAS:2567`). No mafia
 *   involvement; pure on-ice goonery.
 *
 * - `zombiPowdered` (`30000 + realSpe`) — the player has been dosed
 *   with **zombipulveri**, a mystery substance the manager can buy
 *   from a random event and feed to a player. The real `spe` is
 *   stashed as `30000 + realSpe`. Each turn the engine rolls
 *   `tarko(u(pv), 6, 5, 30)` (luck, weight 5, base 30 — see
 *   `attribute-roll.ts`); on success the offset clears and the
 *   player wakes up unchanged; on failure they go PERMA `zombie`
 *   (spe=13) with `psk = 1` and other attributes floored
 *   (`ILEX5.BAS:257-271`).
 *
 *   Tactical use: zombified players are easy to re-sign for nothing
 *   (zero salary), and a player who comes back from zombification
 *   keeps their original skill. Combined with the **CCCP pills**
 *   sold by Soviet randos in another event (which raise `psk`),
 *   this enables the emergent "permanent zero-salary superstar"
 *   exploit — feed pulveri, hope they recover, then pump skill back
 *   up with pills. Zombies never age, so they never retire either.
 *   Almost certainly unintended by MikroBitti; preserve the
 *   mechanic verbatim.
 */
export const PLAYER_SPECIALTY_SENTINELS = {
  muilutusOrdered: 666,
  zombiPowderedBase: 30000
} as const;
