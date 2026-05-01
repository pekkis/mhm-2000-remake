/**
 * Pekkalandian banking sector. Three lenders, each with a fixed
 * annual interest rate and a base credit ceiling.
 *
 * Source data is split across two QB files:
 *
 * - `DATA/PANKI.M2K` — name and interest rate, three rows
 *   (`MHM2K.BAS:956`, parsed into `panknim()` + `pankkor()`).
 * - `DATA/DATAX.M2K` records 35..37 — base credit ceilings, parsed
 *   into `luotto(1..3)` (`MHM2K.BAS:802..804`).
 *
 * The narrative flavor for each bank lives in `DATA/X.MHM` (loan-screen
 * help text). Preserved verbatim where reasonable.
 *
 * Per-team max loan in the original is computed at runtime as
 * `luotto(bank) * (4 - sr(team))`, where `sr` is the team's series
 * tier (1 = PHL, 2 = Divisioona, 3 = Mutasarja — see `ILEZ5.BAS:1226`).
 * So a PHL team can borrow 3× the base, a Divisioona team 2×, and a
 * Mutasarja team 1×. That multiplier belongs in the loan service, not
 * in this static definition — `creditLimit` here is the QB `luotto`
 * base value.
 *
 * Interest is collected every 44 game ticks
 * (`ILEX5.BAS:3546` — `laina * pankkor / 44`); the rate stored here is
 * the QB `pankkor` value (annualish percentage as a decimal).
 */
export type BankDefinition = {
  id: string;
  /** Display name, preserved verbatim from `PANKI.M2K`. */
  name: string;
  /** Annual interest rate as a decimal (e.g. 0.22 = 22%). */
  interestRate: number;
  /**
   * Base credit ceiling in EUR. Effective per-team maximum loan is
   * `creditLimit * (4 - seriesTier)` — PHL teams 3×, Divisioona 2×,
   * Mutasarja 1×.
   */
  creditLimit: number;
};

export const banks: ReadonlyArray<BankDefinition> = [
  {
    id: "merita",
    name: "MëRITÄ",
    interestRate: 0.22,
    creditLimit: 200000
  },
  {
    id: "valiveto",
    name: "VÄLIVETO OY",
    interestRate: 0.25,
    creditLimit: 400000
  },
  {
    id: "ivans-invest",
    name: "IVAN'S INVEST",
    interestRate: 0.18,
    creditLimit: 1000000
    // ⚠️ Borrowing even one pekka here flips the per-manager `mafia`
    // flag (`ILEX5.BAS:4126`). Once flagged, the event walker can
    // fire Russian-mob-only branches: morality-tested morale hits,
    // forced match-fixing (`sovtap = 1`), and an interactive shake-
    // down where refusing queues pranks against you. The flag only
    // clears (per-rollover 30% chance) AFTER the Ivan loan is fully
    // repaid (`ILEX5.BAS:7728..7729`). The lowest interest rate is
    // bait — you can never refuse.
  }
];
