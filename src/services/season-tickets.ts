/**
 * Season-ticket drive — port of QB `SUB kausikorttimaar` (ILEX5.BAS:2507-2556).
 *
 * Called 10 times during the preseason (6 idle + 4 practice rounds).
 * Each call sells one batch of `d` tickets per team, accumulating on
 * `team.seasonTickets`. The manager pockets `d × ticketPrice × 22`
 * (pre-paid revenue for all 22 regular-season home games).
 *
 * The `seasonTickets` counter is reset to 0 at season start.
 */

import type { Random } from "random-js";

/**
 * QB `lhinta(1..3)` — seated ticket price by league tier.
 * Standing tickets are 75% of these (used elsewhere in gate revenue).
 */
export const TICKET_PRICE: Record<1 | 2 | 3, number> = {
  1: 20, // PHL
  2: 18, // Divisioona
  3: 15 // Mutasarja
};

/** Number of regular-season home games season tickets cover. */
const HOME_GAMES = 22;

/** QB `c` base constant per league tier. */
const LEAGUE_BASE: Record<1 | 2 | 3, number> = {
  1: 110, // PHL
  2: 85, // Divisioona
  3: 50 // Mutasarja
};

/** Form midpoint — `sin2 = 8 - sin1`. Good form = positive. */
const FORM_MIDPOINT = 8;

type SeasonTicketParams = {
  /** Arena seated capacity in units of 100. QB `paikka(2, team)`. */
  seatedCount: number;
  /** Tickets already sold this preseason. QB `kausik(team)`. */
  seasonTickets: number;
  /** 1 = PHL, 2 = Div, 3 = Mut. QB `sr(team)`. */
  tier: 1 | 2 | 3;
  /**
   * Weighted 3-season form: `(sed*2 + sedd + seddd) / 4`.
   * QB `sed(t)` = current season ranking, `sedd` = last, `seddd` = two ago.
   * Lower = better (1st place = 1).
   */
  formAverage: number;
  /** Arena comfort tier 1-6. QB `taso(team)`. */
  arenaLevel: number;
  /** Manager attribute 5 (charisma), range -3..+3. QB `mtaito(5, man)`. */
  managerCharisma: number;
  /**
   * Mean charisma of the rostered players. QB `avg(3, ohj)` — the
   * average `kar` across the team's roster. Neutral = 10.
   */
  rosterCharismaAvg: number;
  /**
   * QB `boikotti(ohj)` — active fan boycott. When > 0, tickets sold
   * are reduced by 20%. Omit or pass 0 when boycott system is unported.
   */
  boycott?: number;
  random: Random;
};

type SeasonTicketResult = {
  /** Number of new season tickets sold this batch. */
  ticketsSold: number;
  /** Revenue to credit to the manager. `ticketsSold × ticketPrice × 22`. */
  revenue: number;
};

/**
 * Sell one batch of season tickets for a single team.
 * Pure function — all randomness via the injected `random`.
 */
export const sellSeasonTickets = (
  params: SeasonTicketParams
): SeasonTicketResult => {
  const {
    seatedCount,
    seasonTickets,
    tier,
    formAverage,
    arenaLevel,
    managerCharisma,
    rosterCharismaAvg,
    boycott,
    random
  } = params;

  const remainingSeats = seatedCount * 100 - seasonTickets;
  if (remainingSeats <= 0) {
    return { ticketsSold: 0, revenue: 0 };
  }

  const c = LEAGUE_BASE[tier];
  const sin2 = FORM_MIDPOINT - formAverage;

  let d: number;
  let sin3: number;

  if (sin2 > 0) {
    // Good form — aggressive exponential scaling
    d = c ** (1 + sin2 / 50);
    sin3 = 1 + (arenaLevel - 3) * (0.005 + sin2 / 200);
  } else {
    // Poor form — gentler exponential scaling
    d = c ** (1 + sin2 / 100);
    sin3 = 1 + (arenaLevel - 3) * 0.005;
  }

  // Comfort tier multiplier
  d = d ** sin3;

  // Manager charisma: ±6% range (attribute -3..+3 × 0.02)
  d = d * (1 + managerCharisma * 0.02);

  // Roster charisma: avg(3) of 10 is neutral, 14 → +8%, 6 → -8%
  d = d * (1 + (rosterCharismaAvg - 10) / 50);

  // ±5% noise band
  d = 0.95 * d + 0.1 * random.real(0, 1) * d;

  // ±1 integer jitter: INT(3 * RND) - 1 → {-1, 0, 1}
  d = d + random.integer(0, 2) - 1;

  // Cap at remaining seated capacity
  if (d > remainingSeats) {
    d = remainingSeats;
  }

  // Floor at 0 (poor-form teams with tiny arenas could go negative)
  if (d < 0) {
    d = 0;
  }

  // Boycott penalty — 20% reduction
  if (boycott !== undefined && boycott > 0) {
    d = d * 0.8;
  }

  const ticketsSold = Math.floor(d);
  const revenue = ticketsSold * TICKET_PRICE[tier] * HOME_GAMES;

  return { ticketsSold, revenue };
};
