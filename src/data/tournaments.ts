/**
 * MHM 2000 Christmas invitation tournaments (joulu-turnaukset).
 *
 * 10 tiers, each a 6-team round-robin played during the Christmas break
 * (kiero=98). Prize data from JT1..JT10.PLX, names from DATAX.M2K
 * rows 4–13. See _NOTES/TOURNAMENTS.md for the full archaeology.
 *
 * QB source: SUB joulutauko (ILEX5.BAS:2268-2324),
 *            SUB kutsuturnaus (ILEX5.BAS:2974-2993)
 */

import type { Team } from "@/state/game";

// --- Candidate pool types ---

export type CandidatePool = {
  /** Relative weight for random pool selection (e.g. 40 = 40%). */
  weight: number;
  /** Team ids eligible for this pool. */
  teams: number[];
};

// --- Helpers for building candidate pools ---

/**
 * Domestic teams sorted by previous-season ranking (best first),
 * sliced to ranks `from..to` (1-based inclusive). Teams without
 * `previousRankings` sort last.
 */
const domesticByRanking = (teams: Team[], from: number, to: number): number[] =>
  teams
    .filter((t) => t.domestic)
    .toSorted(
      (a, b) =>
        (a.previousRankings?.[0] ?? 99) - (b.previousRankings?.[0] ?? 99)
    )
    .slice(from - 1, to)
    .map((t) => t.id);

const withTag = (teams: Team[], tag: string): number[] =>
  teams.filter((t) => t.tags.includes(tag)).map((t) => t.id);

// --- Tournament definition ---

export type TournamentDefinition = {
  id: string;
  name: string;
  /** Prize money for placements 1st–6th. Verbatim from JTn.PLX. */
  prizes: [number, number, number, number, number, number];
  /**
   * Maximum previous-season ranking (sed) that qualifies for this
   * tournament. Lower sed = better team. A team with
   * `previousRankings[0] <= maxPreviousRanking` sees this tournament in the
   * invitation menu.
   *
   * Derived from TKUTSU.M2K: sed → minimum visible tier. Inverted
   * here so each tournament carries its own cutoff.
   */
  maxPreviousRanking: number;
  /**
   * AI seeding priority. Tournaments are seeded in ascending order
   * of this value — lower weight seeds first. QB iterates tier 10→1,
   * so KIVESJÄRVI (weight 1000) picks AI teams before NHL CHALLENGE
   * (weight 10000).
   */
  seedOrder: number;
  /**
   * Returns the weighted candidate pools for AI filler teams.
   * The seeder picks a pool by weight, then a random team from it,
   * rejecting any already seated across tournaments.
   *
   * QB source: SUB joulutauko (ILEX5.BAS:2268-2324), per-tier
   * branching at lines 2290-2318.
   */
  candidatePools: (teams: Team[]) => CandidatePool[];
};

/**
 * All 10 Christmas tournaments, indexed by tier (1 = most prestigious).
 *
 * Prize anomalies preserved from QB data:
 * - JT3 (MARBORLO): slot 3 (650k) > slot 2 (600k) — non-monotonic
 * - JT5 (SÖNERÄ): slot 5 (250k) > slot 4 (200k) — non-monotonic;
 *   original file had 7 lines, 7th (150k) ignored by maarpalk
 */
const tournamentList: TournamentDefinition[] = [
  {
    id: "nhl-challenge",
    name: "NHL CHALLENGE",
    maxPreviousRanking: 1,
    seedOrder: 10_000,
    prizes: [4_000_000, 600_000, 550_000, 500_000, 450_000, 400_000],
    // Deterministic: NHL teams fill the remaining seats.
    // The top PHL team (tietos) is seated separately by the seeder.
    candidatePools: (teams) => [{ weight: 100, teams: withTag(teams, "nhl") }]
  },
  {
    id: "nogia",
    name: "NOGIA TOURNAMENT",
    maxPreviousRanking: 5,
    seedOrder: 9_000,
    prizes: [900_000, 700_000, 650_000, 600_000, 550_000, 500_000],
    // 40% top-5 PHL, 60% foreign EHL champions
    candidatePools: (teams) => [
      { weight: 40, teams: domesticByRanking(teams, 1, 5) },
      { weight: 60, teams: withTag(teams, "ehl") }
    ]
  },
  {
    id: "marborlo",
    name: "MARBORLO TOURNAMENT",
    maxPreviousRanking: 10,
    seedOrder: 8_000,
    // QB data anomaly: slot 3 (650k) > slot 2 (600k)
    prizes: [800_000, 600_000, 650_000, 600_000, 550_000, 500_000],
    // 50% top-12 PHL, 50% foreign EHL champions
    candidatePools: (teams) => [
      { weight: 50, teams: domesticByRanking(teams, 1, 12) },
      { weight: 50, teams: withTag(teams, "ehl") }
    ]
  },
  {
    id: "gogo-cola",
    name: "GOGO-COLA CUP",
    maxPreviousRanking: 17,
    seedOrder: 7_000,
    prizes: [700_000, 500_000, 450_000, 400_000, 350_000, 300_000],
    // 70% top-12 PHL, 30% ranks 5–16
    candidatePools: (teams) => [
      { weight: 70, teams: domesticByRanking(teams, 1, 12) },
      { weight: 30, teams: domesticByRanking(teams, 5, 16) }
    ]
  },
  {
    id: "sonero",
    name: "SÖNERÄ-TURNAUS",
    maxPreviousRanking: 23,
    seedOrder: 6_000,
    // QB data anomaly: slot 5 (250k) > slot 4 (200k)
    prizes: [400_000, 275_000, 250_000, 200_000, 250_000, 200_000],
    // 20% top-12 PHL, 80% ranks 13–24
    candidatePools: (teams) => [
      { weight: 20, teams: domesticByRanking(teams, 1, 12) },
      { weight: 80, teams: domesticByRanking(teams, 13, 24) }
    ]
  },
  {
    id: "susiraja",
    name: "SUSIRAJA-TURNAUS",
    maxPreviousRanking: 29,
    seedOrder: 5_000,
    prizes: [250_000, 200_000, 150_000, 125_000, 100_000, 75_000],
    // 50% ranks 12–23, 50% ranks 25–48
    candidatePools: (teams) => [
      { weight: 50, teams: domesticByRanking(teams, 12, 23) },
      { weight: 50, teams: domesticByRanking(teams, 25, 48) }
    ]
  },
  {
    id: "hirvikoski",
    name: "HIRVIKOSKI-PÄIVÄT",
    maxPreviousRanking: 34,
    seedOrder: 4_000,
    prizes: [170_000, 125_000, 100_000, 75_000, 60_000, 45_000],
    // 25% ranks 12–23, 75% ranks 25–48
    candidatePools: (teams) => [
      { weight: 25, teams: domesticByRanking(teams, 12, 23) },
      { weight: 75, teams: domesticByRanking(teams, 25, 48) }
    ]
  },
  {
    id: "narpio",
    name: "NÄRPIÖN HOKI-VESTIVAL",
    maxPreviousRanking: 40,
    seedOrder: 3_000,
    prizes: [150_000, 100_000, 80_000, 60_000, 40_000, 30_000],
    // 70% ranks 25–48, 30% amateur (mutasarja extras)
    candidatePools: (teams) => [
      { weight: 70, teams: domesticByRanking(teams, 25, 48) },
      { weight: 30, teams: withTag(teams, "amateur") }
    ]
  },
  {
    id: "aavasaksa",
    name: "AAVASAKSA OPEN ICE",
    maxPreviousRanking: 46,
    seedOrder: 2_000,
    prizes: [100_000, 50_000, 30_000, 25_000, 20_000, 15_000],
    // 25% ranks 25–48, 75% amateur
    candidatePools: (teams) => [
      { weight: 25, teams: domesticByRanking(teams, 25, 48) },
      { weight: 75, teams: withTag(teams, "amateur") }
    ]
  },
  {
    id: "kivesjarvi",
    name: "KIVESJÄRVI CUP",
    maxPreviousRanking: 48,
    seedOrder: 1_000,
    prizes: [80_000, 60_000, 40_000, 30_000, 20_000, 10_000],
    // 100% amateur (mutasarja extras only)
    candidatePools: (teams) => [
      { weight: 100, teams: withTag(teams, "amateur") }
    ]
  }
];

export default tournamentList;
