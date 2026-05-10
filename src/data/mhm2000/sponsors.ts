/**
 * Sponsorship system — types, data, and pure functions.
 *
 * Port of `SUB sponsorit` (ILEX5.BAS:6642) + `SUB annarahaa`
 * (ILEX5.BAS:597, ILEZ5.BAS:232). Full QB decode in
 * `src/mhm2000-qb/_NOTES/SPONSORS.md`.
 *
 * Architecture: pure data + pure functions here; wiring into the
 * machine layer happens elsewhere (preseason calendar tick spawns a
 * negotiation wizard, phase actions call `applySponsorPayout`).
 */

// ---------------------------------------------------------------------------
// Payout slot identifiers
// ---------------------------------------------------------------------------

/**
 * The 20 sponsor payout slots, mapped from QB `sponso(1..20, pv)`.
 *
 * Slots 1–10 are positive bonuses, 11–19 are negative penalties,
 * slot 20 is the per-match base fee. Values are signed — penalties
 * are stored as negative numbers.
 *
 * | QB # | TS key                 | Label (FI)                              |
 * | ---- | ---------------------- | --------------------------------------- |
 * |  1   | phlChampion            | MESTARUUS                               |
 * |  2   | phlSilver              | HOPEA                                   |
 * |  3   | phlBronze              | PRONSSI                                 |
 * |  4   | phlFourth              | NELJÄS SIJA                             |
 * |  5   | playoffQualification   | PÄÄSY PLAY-OFFEIHIN                     |
 * |  6   | cupWinner              | CUPIN VOITTO                            |
 * |  7   | cupPerRound            | KIERROS/CUP                             |
 * |  8   | ehlChampion            | EUROOPAN MESTARUUS                      |
 * |  9   | ehlQualification       | PÄÄSY EHL-LOPPUTURNAUKSEEN              |
 * | 10   | promoted               | SARJANOUSU                              |
 * | 11   | noMedal                | MITALITTA JÄÄMINEN                      |
 * | 12   | semifinalElimination   | SEMIFINAALEISTA KARSIUTUMINEN           |
 * | 13   | playoffMiss            | PLAY-OFFEISTA ULOS JÄÄMINEN             |
 * | 14   | relegationPlayoff      | KARSINTAAN JOUTUMINEN                   |
 * | 15   | relegated              | PUTOAMINEN                              |
 * | 16   | cupPreSemifinalLoss    | PUTOAMINEN CUPISTA ENNEN SEMIFINAALEJA  |
 * | 17   | cupFirstRoundLoss      | PUTOAMINEN CUPISTA 1. KIERROKSELLA      |
 * | 18   | ehlMiss                | EHL:N LOPPUTURNAUKSESTA KARSIUTUMINEN   |
 * | 19   | noPromotion            | EI SARJANOUSUA                          |
 * | 20   | perMatchFee            | OTTELUMAKSU                             |
 */
export const sponsorPayoutSlots = [
  "phlChampion",
  "phlSilver",
  "phlBronze",
  "phlFourth",
  "playoffQualification",
  "cupWinner",
  "cupPerRound",
  "ehlChampion",
  "ehlQualification",
  "promoted",
  "noMedal",
  "semifinalElimination",
  "playoffMiss",
  "relegationPlayoff",
  "relegated",
  "cupPreSemifinalLoss",
  "cupFirstRoundLoss",
  "ehlMiss",
  "noPromotion",
  "perMatchFee"
] as const;

export type SponsorPayoutSlot = (typeof sponsorPayoutSlots)[number];

/**
 * Maps our TS slot keys back to QB 1-based indices (for reference and
 * label lookup from Y.MHM records 146..165).
 */
export const sponsorSlotToQbIndex: Record<SponsorPayoutSlot, number> = {
  phlChampion: 1,
  phlSilver: 2,
  phlBronze: 3,
  phlFourth: 4,
  playoffQualification: 5,
  cupWinner: 6,
  cupPerRound: 7,
  ehlChampion: 8,
  ehlQualification: 9,
  promoted: 10,
  noMedal: 11,
  semifinalElimination: 12,
  playoffMiss: 13,
  relegationPlayoff: 14,
  relegated: 15,
  cupPreSemifinalLoss: 16,
  cupFirstRoundLoss: 17,
  ehlMiss: 18,
  noPromotion: 19,
  perMatchFee: 20
};

/**
 * Finnish labels for the 20 payout slots. Verbatim from Y.MHM records
 * 146..165 (rendered via `lay 145+arg` in `SUB sponsorit` / `sporvagen`).
 */
export const sponsorSlotLabel: Record<SponsorPayoutSlot, string> = {
  phlChampion: "MESTARUUS",
  phlSilver: "HOPEA",
  phlBronze: "PRONSSI",
  phlFourth: "NELJÄS SIJA",
  playoffQualification: "PÄÄSY PLAY-OFFEIHIN",
  cupWinner: "CUPIN VOITTO",
  cupPerRound: "KIERROS/CUP",
  ehlChampion: "EUROOPAN MESTARUUS",
  ehlQualification: "PÄÄSY EHL-LOPPUTURNAUKSEEN",
  promoted: "SARJANOUSU",
  noMedal: "MITALITTA JÄÄMINEN",
  semifinalElimination: "SEMIFINAALEISTA KARSIUTUMINEN",
  playoffMiss: "PLAY-OFFEISTA ULOS JÄÄMINEN",
  relegationPlayoff: "KARSINTAAN JOUTUMINEN",
  relegated: "PUTOAMINEN",
  cupPreSemifinalLoss: "PUTOAMINEN CUPISTA ENNEN SEMIFINAALEJA",
  cupFirstRoundLoss: "PUTOAMINEN CUPISTA 1. KIERROKSELLA",
  ehlMiss: "EHL:N LOPPUTURNAUKSESTA KARSIUTUMINEN",
  noPromotion: "EI SARJANOUSUA",
  perMatchFee: "OTTELUMAKSU"
};

// ---------------------------------------------------------------------------
// Sponsor deal — the persistent per-manager state
// ---------------------------------------------------------------------------

/**
 * Signed payout amounts for each of the 20 slots. Bonuses are positive,
 * penalties are negative. Zero means "no stake in this outcome".
 */
export type SponsorPayouts = Record<SponsorPayoutSlot, number>;

export type SponsorDeal = {
  /** Cosmetic sponsor name from SPONDATA.M2K. No gameplay effect. */
  name: string;
  /** The 20 payout slots — signed amounts. */
  payouts: SponsorPayouts;
};

/**
 * Empty deal — all slots zero, no name. Used when a manager has no
 * sponsor (season start before negotiation, or the QB soft-lock edge
 * case where all three candidates walk).
 */
export const emptySponsorPayouts: SponsorPayouts = Object.fromEntries(
  sponsorPayoutSlots.map((s) => [s, 0])
) as SponsorPayouts;

// ---------------------------------------------------------------------------
// Goal categories — the 4 ambition axes
// ---------------------------------------------------------------------------

export type GoalCategoryId = "phl" | "divMut" | "cup" | "ehl";

export type GoalLevel = 1 | 2 | 3 | 4;

export type GoalCategory = {
  id: GoalCategoryId;
  /** Maximum selectable level (0 = category unavailable). */
  maxLevel: number;
};

/**
 * Finnish labels for goal category headers. Hardcoded in QB
 * (ILEX5.BAS:6822-6823), not from Y.MHM.
 */
export const goalCategoryLabel: Record<GoalCategoryId, string> = {
  phl: "PHL",
  divMut: "DIV & MUT",
  cup: "CUP",
  ehl: "EHL"
};

/**
 * Finnish labels for each goal level within each category.
 * From Y.MHM records 170..182 (500-byte random-access records, cp850).
 *
 * Level 1 is always "EI" (no goal). Higher levels are competition-
 * specific ambition targets.
 */
export const goalLevelLabels: Record<GoalCategoryId, readonly string[]> = {
  phl: ["EI", "PLAY-OFFIT", "SEMIFINAALI", "MITALI"],
  divMut: ["EI", "PLAY-OFFIT", "SARJANOUSU"],
  cup: ["EI", "2. KIERROS", "SEMIFINAALI"],
  ehl: ["EI", "LOPPUTURNAUS", "EUROOPAN MESTARUUS"]
};

/**
 * UI action button labels from Y.MHM records 183..184.
 */
export const negotiationActionLabels = {
  haggle: "NEUVOTTELE",
  accept: "HYVÄKSY"
} as const;

/**
 * Determine which goal categories are available for a given team.
 *
 * QB: `seks(1..4)` in `SUB sponsorit` (ILEX5.BAS:6654-6657).
 *
 * @param tier - team's current tier (1 = PHL, 2 = Divisioona, 3 = Mutasarja)
 * @param ehlQualified - whether the team qualified for EHL (`muke(pv) = 1`)
 */
export const goalCategories = (
  tier: number,
  ehlQualified: boolean
): GoalCategory[] => [
  { id: "phl", maxLevel: tier === 1 ? 4 : 0 },
  { id: "divMut", maxLevel: tier > 1 ? 3 : 0 },
  { id: "cup", maxLevel: 3 },
  { id: "ehl", maxLevel: ehlQualified ? 3 : 0 }
];

// ---------------------------------------------------------------------------
// Sponsor names — the 93-name pool from SPONDATA.M2K
// ---------------------------------------------------------------------------

/**
 * cp850 → UTF-8 decoded sponsor names. Verbatim from
 * `src/mhm2000-qb/DATA/SPONDATA.M2K`. The names are pure flavour —
 * they have zero gameplay effect. Preserve the dated-Finnish-90s tone.
 */
export const sponsorNames: readonly string[] = [
  "Anttinen",
  "Apela",
  "Asicks",
  "Balbot",
  "Banan+",
  "Bebsi",
  "Burmbok",
  "Carloksen Cauppa",
  "Compact",
  "Crash Broker",
  "Deutsche Pank",
  "Eiriksson",
  "Emer OY",
  "Etelälä",
  "EuroAthletics",
  "Euran Aallot",
  "Ferarri",
  "Filips",
  "General Engines",
  "GoGo-Cola",
  "Harrin Rafla",
  "Henson & Bedges",
  "Hitler&Mobutu H&M",
  "Hjartwall",
  "Hunda",
  "Höstburger",
  "IMB",
  "Ivan's Invest",
  "Kaarlon Kuteet",
  "Kaamel",
  "Karlsberg",
  "Kelia",
  "Keskos",
  "Klagen Kessu",
  "Klasun Kirkas",
  "Koof",
  "Landa-Siideri",
  "Lapin Multa",
  "Lionia",
  "Lähikauppa Karpela",
  "MacOkselds",
  "Makaabersoft",
  "Malborlo",
  "Maso TV",
  "Merimekko",
  "Mercydes",
  "Musik TV",
  "Märitä",
  "Nake",
  "Nationswagen",
  "Nogia",
  "Notorola",
  "O-Optikko",
  "Olles",
  "Oskun Olut",
  "Otso",
  "Pakidas",
  "Panther",
  "Patun Pontikka",
  "Peran Pub",
  "Petterisoft",
  "Peugoth",
  "Pewlett-Hackard",
  "Pirkon Putiikki",
  "Pizza Cab",
  "Radio Cosa Nostra",
  "Radio Ysiysi",
  "Rapen Röhät",
  "Röminälinja",
  "Sabb",
  "SamBo",
  "Schpar",
  "Seimens",
  "Silvery Cap",
  "Siperian Walinta",
  "Small Mall",
  "South",
  "Spelstatzion",
  "Spit FM",
  "Spudweiser",
  "Stocksmann",
  "Syöpälahden Serveri",
  "Sönerä",
  "Söny",
  "Toyauto",
  "Traband",
  "Uwekrupp",
  "Veskun Valinta",
  "Vivo",
  "Vovlo",
  "Väliveto INC",
  "Webscape",
  "Woodhacker"
];

// ---------------------------------------------------------------------------
// Offer computation — pure functions
// ---------------------------------------------------------------------------

/**
 * Compute the base per-match fee for a sponsor offer.
 *
 * QB: `spr(curso, 20) = 20000 * (1 + sin1 * .07) * CSNG(vai(3, pv) / 100)`
 * where `sin1 = 49 - mean(sed, sedd, seddd)`.
 *
 * @param previousRankings - 3-season rolling PHL rankings `[latest, prev, oldest]`
 * @param sponsorScalePercent - difficulty-tier sponsor scale (90..200)
 */
export const basePerMatchFee = (
  previousRankings: [number, number, number],
  sponsorScalePercent: number
): number => {
  const [r1, r2, r3] = previousRankings;
  const sin1 = 49 - (r1 + r2 + r3) / 3;
  return Math.trunc(20_000 * (1 + sin1 * 0.07) * (sponsorScalePercent / 100));
};

/**
 * Build the 20-slot payout array for a given set of goal ambitions.
 *
 * Pure port of the SELECT CASE blocks in `SUB sponsorit`
 * (ILEX5.BAS:6703-6770). All values are relative to `base` (slot 20).
 *
 * @param base - the per-match fee (slot 20 value)
 * @param goals - chosen ambition level per category (1 = EI / no goal)
 * @param tier - team's current tier (1 = PHL, 2 = Divisioona, 3 = Mutasarja)
 * @param jitter - per-slot random multiplier array (20 values, range ~0.90–1.00)
 */
export const buildOfferPayouts = (
  base: number,
  goals: Record<GoalCategoryId, GoalLevel>,
  tier: number,
  jitter: readonly number[]
): SponsorPayouts => {
  // Start with all zeros, set slot 20 = base
  const spr = new Array<number>(20).fill(0);
  spr[19] = base; // slot 20 (0-indexed: 19)

  // Category 1 — PHL ambition
  switch (goals.phl) {
    case 2:
      spr[4] = spr[19] * 3; // slot 5
      spr[12] = -1.2 * spr[4]; // slot 13
      spr[13] = 0.3 * spr[12]; // slot 14
      spr[14] = 0.4 * spr[12]; // slot 15
      break;
    case 3:
      spr[0] = 5 * spr[19]; // slot 1
      spr[1] = 4.5 * spr[19]; // slot 2
      spr[2] = 4 * spr[19]; // slot 3
      spr[3] = 3.5 * spr[19]; // slot 4
      spr[11] = -0.8 * spr[0]; // slot 12
      spr[12] = 0.3 * spr[11]; // slot 13
      spr[13] = 0.2 * spr[11]; // slot 14
      spr[14] = 0.1 * spr[11]; // slot 15
      break;
    case 4:
      spr[0] = 8 * spr[19]; // slot 1
      spr[1] = 7 * spr[19]; // slot 2
      spr[2] = 6 * spr[19]; // slot 3
      spr[10] = -1 * spr[0]; // slot 11
      spr[11] = 0.2 * spr[10]; // slot 12
      spr[12] = 0.18 * spr[10]; // slot 13
      spr[13] = 0.16 * spr[10]; // slot 14
      spr[14] = 0.14 * spr[10]; // slot 15
      break;
  }

  // Category 2 — DIV/MUT ambition
  switch (goals.divMut) {
    case 2:
      spr[4] = 3 * spr[19]; // slot 5
      spr[9] = 1.5 * spr[19]; // slot 10
      spr[12] = -1.2 * spr[4]; // slot 13
      if (tier === 2) {
        spr[13] = 0.3 * spr[12]; // slot 14
        spr[14] = 0.4 * spr[12]; // slot 15
      }
      break;
    case 3:
      spr[9] = 8 * spr[19]; // slot 10
      spr[12] = -0.1 * spr[9]; // slot 13
      spr[18] = -0.75 * spr[9]; // slot 19
      if (tier === 2) {
        spr[13] = 0.25 * spr[18]; // slot 14
        spr[14] = 0.5 * spr[18]; // slot 15
      }
      break;
  }

  // Category 3 — CUP ambition
  switch (goals.cup) {
    case 2:
      spr[6] = 1.25 * spr[19]; // slot 7
      spr[16] = -1.5 * spr[6]; // slot 17
      break;
    case 3:
      spr[5] = 2.5 * spr[19]; // slot 6
      spr[6] = 1.5 * spr[19]; // slot 7
      spr[15] = -6 * spr[6]; // slot 16
      spr[16] = -2 * spr[6]; // slot 17
      break;
  }

  // Category 4 — EHL ambition
  switch (goals.ehl) {
    case 2:
      spr[8] = 3.5 * spr[19]; // slot 9
      spr[17] = -0.9 * spr[8]; // slot 18
      break;
    case 3:
      spr[7] = 8 * spr[19]; // slot 8
      spr[17] = -0.9 * spr[7]; // slot 18
      break;
  }

  // Apply per-slot jitter
  for (let i = 0; i < 20; i++) {
    spr[i] = Math.trunc(spr[i] * jitter[i]);
  }

  // Convert to named record
  const payouts = { ...emptySponsorPayouts };
  for (let i = 0; i < sponsorPayoutSlots.length; i++) {
    payouts[sponsorPayoutSlots[i]] = spr[i];
  }
  return payouts;
};

/**
 * Generate the per-slot random jitter for one candidate.
 *
 * QB: `spp(qwe, cupex) = .9 + .05 * RND` — range 0.90–0.95 without
 * arena bonus, 0.95–1.00 with it. Never exceeds 1.0.
 *
 * @param random - RNG source
 * @param hasTopArena - whether `paikka(3, u(pv)) = 1`
 */
export const rollCandidateJitter = (
  random: { real: (min: number, max: number) => number },
  hasTopArena: boolean
): number[] => {
  const jitter: number[] = [];
  for (let i = 0; i < 20; i++) {
    let v = 0.9 + 0.05 * random.real(0, 1);
    if (hasTopArena) {
      v += 0.05;
    }
    jitter.push(v);
  }
  return jitter;
};

// ---------------------------------------------------------------------------
// Negotiation — haggle roll + bonus bump
// ---------------------------------------------------------------------------

/**
 * The NEUVOTTELE success threshold.
 *
 * QB: `tarko(u(pv), 3, 5, 97 - spn * 5)` where attribute 3 =
 * `negotiation` and `spn` = number of prior haggles on this candidate.
 *
 * Result: `roll < base + negotiation * weight` where base decreases
 * by 5 per haggle and weight = 5.
 *
 * @param hagglesCompleted - number of successful prior haggles on this candidate
 * @param negotiationSkill - manager's negotiation attribute (-3..+3)
 */
export const haggleSuccessThreshold = (
  hagglesCompleted: number,
  negotiationSkill: number
): number => 97 - hagglesCompleted * 5 + negotiationSkill * 5;

/**
 * Apply the bonus bump to positive slots after a successful haggle.
 *
 * QB: for each slot with `spr > 0`, 50% chance to multiply by
 * `1 + (0.015 + 0.01 * RND)` — i.e. +1.5% to +2.5%.
 * Penalty slots (negative) are never bumped.
 *
 * Mutates `payouts` in place (caller is expected to be in an immer
 * draft or working on a local copy).
 */
export const applyHaggleBump = (
  payouts: SponsorPayouts,
  random: {
    integer: (min: number, max: number) => number;
    real: (min: number, max: number) => number;
  }
): void => {
  for (const slot of sponsorPayoutSlots) {
    if (payouts[slot] > 0) {
      // QB: tarko(u(pv), 3, 0, 50) — flat 50%, no attribute bonus
      if (random.integer(1, 100) <= 50) {
        const bump = 0.015 + 0.01 * random.real(0, 1);
        payouts[slot] = Math.trunc(payouts[slot] + bump * payouts[slot]);
      }
    }
  }
};
