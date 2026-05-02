/**
 * Decoded MHM 2000 calendar (`KIERO.M2K`).
 *
 * Source: src/mhm2000-qb/DATA/KIERO.M2K — 99 records, three CSV columns
 * (`kiero`, `kiero2`, `kiero3`). Loaded by `MHM2K.BAS:914` into
 * `kiero(-9..89)` etc. The QB index `kr` runs from -9 to 89:
 *   * `kr` = -9..0  → preseason (10 records)
 *   * `kr` =  1..89 → season + playoffs (89 records)
 *
 * This file is a verbatim, annotated transcription of the binary table.
 * It is **not** consumed by the runtime engine. It exists as a one-shot
 * source for building the actual `src/data/calendar.ts` by hand.
 *
 * Column meanings (verified against ILEX5.BAS:455-516 + the gameday
 * handlers):
 *
 *  ## kiero — round type
 *  | code | label / behaviour                                      |
 *  |------|--------------------------------------------------------|
 *  |   1  | runkosarjapelipäivä (PHL + Divisioona + Mutasarja)     |
 *  |   2  | EHL-pelipäivä                                          |
 *  |   3  | cup-pelipäivä (Pekkalan Cup)                           |
 *  |   4  | harjoitusottelu (training match)                       |
 *  |  22  | EHL:n lopputurnaus (EHL final tournament)              |
 *  |  41  | playoff QF draw (no games)                             |
 *  |  42  | playoff QF gameday                                     |
 *  |  43  | playoff SF draw                                        |
 *  |  44  | playoff SF gameday                                     |
 *  |  45  | playoff Final draw                                     |
 *  |  46  | playoff Final gameday                                  |
 *  |  47  | PHL:n juhlagaala (season-end gala)                     |
 *  |  48  | uusikausi (rollover marker)                            |
 *  |  96  | vapaa viikonloppu (free weekend)                       |
 *  |  97  | maajoukkuetauko (national team break)                  |
 *  |  98  | kutsuturnaus (per-manager invitation tournament)       |
 *  |  99  | preseason filler ("X viikkoa kauden alkuun")           |
 *
 *  ## kiero2 — transfer market open flag (0/1)
 *  Drives the `pelaajamarkkinat` menu entry (ILEX5.BAS:4275) and ~12
 *  other "while market is open" branches (skouttaus, halpa pelaaja,
 *  väki yli rajan, …).
 *
 *  ## kiero3 — pre-round one-shot SUB trigger (0 = none)
 *  Fired in the pre-gameday block (ILEX5.BAS:169-184 + :225-240) before
 *  the round's main action.
 *  | code | SUB                                  |
 *  |------|--------------------------------------|
 *  |   1  | valitsestrat + tremaar (strategy)    |
 *  |   2  | cuparpo (cup draw)                   |
 *  |   3  | UNIDENTIFIED — appears on records 21-23 (kr=11..13). Not in any visible `SELECT CASE kiero3` block. |
 *  |   4  | borsinit + mass transfer-market generation + cuparpo |
 *  |   5  | suunnitelma (budget / planning)      |
 *  |   6  | tremaar (tactics-only refresh)       |
 *  |   7  | tarkistanhlc (NHL champion check)    |
 *  |  10  | mmkisaalku (World Championships start) |
 *  |  11  | mmkisaloppu (World Championships end) |
 *  |  49  | zreseasongala (season-opening gala)  |
 *  |  99  | sponsorit (sponsor draw)             |
 */

export type RoundType =
  | 1 // regular gameday
  | 2 // EHL gameday
  | 3 // cup gameday
  | 4 // training match
  | 22 // EHL final tournament
  | 41 // QF draw
  | 42 // QF gameday
  | 43 // SF draw
  | 44 // SF gameday
  | 45 // Final draw
  | 46 // Final gameday
  | 47 // season-end gala
  | 48 // uusikausi rollover
  | 96 // free weekend
  | 97 // national team break
  | 98 // invitation tournament
  | 99; // preseason filler

export type PreRoundTrigger =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 10
  | 11
  | 49
  | 99;

export type RawCalendarEntry = {
  /** 1-based file index (1..99) — for cross-referencing KIERO.M2K. */
  fileIndex: number;
  /** QB array index (`kr`), runs from -9 (preseason start) to 89. */
  qbIndex: number;
  /** kiero — round type. */
  type: RoundType;
  /** kiero2 — transfer market open. */
  transferMarket: boolean;
  /** kiero3 — pre-round one-shot SUB. 0 = none. */
  preRound: PreRoundTrigger;
  /** Human-readable annotation. */
  note: string;
};

// prettier-ignore
export const rawCalendar: RawCalendarEntry[] = [
  // ── Preseason (kr -9..0) ──────────────────────────────────────────────
  { fileIndex:  1, qbIndex: -9, type: 99, transferMarket: true,  preRound:  4, note: "preseason -9: transfer market opens, mass börsi gen + cup draw" },
  { fileIndex:  2, qbIndex: -8, type: 99, transferMarket: true,  preRound: 99, note: "preseason -8: sponsorit (sponsor draw)" },
  { fileIndex:  3, qbIndex: -7, type: 99, transferMarket: true,  preRound:  0, note: "preseason -7" },
  { fileIndex:  4, qbIndex: -6, type: 99, transferMarket: true,  preRound:  0, note: "preseason -6" },
  { fileIndex:  5, qbIndex: -5, type: 99, transferMarket: true,  preRound:  0, note: "preseason -5" },
  { fileIndex:  6, qbIndex: -4, type: 99, transferMarket: true,  preRound:  0, note: "preseason -4" },
  { fileIndex:  7, qbIndex: -3, type:  4, transferMarket: true,  preRound:  0, note: "training match -3" },
  { fileIndex:  8, qbIndex: -2, type:  4, transferMarket: true,  preRound:  1, note: "training match -2: valitsestrat (strategy selection)" },
  { fileIndex:  9, qbIndex: -1, type:  4, transferMarket: true,  preRound:  6, note: "training match -1: tremaar (tactics refresh)" },
  { fileIndex: 10, qbIndex:  0, type:  4, transferMarket: true,  preRound: 49, note: "training match 0: zreseasongala (season-opening gala)" },

  // ── First half of regular season, market open (kr 1..47) ─────────────
  { fileIndex: 11, qbIndex:  1, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 1" },
  { fileIndex: 12, qbIndex:  2, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 2" },
  { fileIndex: 13, qbIndex:  3, type:  3, transferMarket: true,  preRound:  0, note: "cup gameday" },
  { fileIndex: 14, qbIndex:  4, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 3" },
  { fileIndex: 15, qbIndex:  5, type:  3, transferMarket: true,  preRound:  0, note: "cup gameday" },
  { fileIndex: 16, qbIndex:  6, type:  2, transferMarket: true,  preRound:  2, note: "EHL gameday + cuparpo (cup draw)" },
  { fileIndex: 17, qbIndex:  7, type: 96, transferMarket: true,  preRound:  0, note: "vapaa viikonloppu (free weekend)" },
  { fileIndex: 18, qbIndex:  8, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 4" },
  { fileIndex: 19, qbIndex:  9, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 5" },
  { fileIndex: 20, qbIndex: 10, type:  2, transferMarket: true,  preRound:  0, note: "EHL gameday" },
  { fileIndex: 21, qbIndex: 11, type:  1, transferMarket: true,  preRound:  3, note: "regular gameday 6 + UNKNOWN kiero3=3" },
  { fileIndex: 22, qbIndex: 12, type:  1, transferMarket: true,  preRound:  3, note: "regular gameday 7 + UNKNOWN kiero3=3" },
  { fileIndex: 23, qbIndex: 13, type:  1, transferMarket: true,  preRound:  3, note: "regular gameday 8 + UNKNOWN kiero3=3" },
  { fileIndex: 24, qbIndex: 14, type:  2, transferMarket: true,  preRound:  7, note: "EHL gameday + tarkistanhlc (NHL champion check)" },
  { fileIndex: 25, qbIndex: 15, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 9" },
  { fileIndex: 26, qbIndex: 16, type: 97, transferMarket: true,  preRound:  0, note: "maajoukkuetauko (national team break)" },
  { fileIndex: 27, qbIndex: 17, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 10" },
  { fileIndex: 28, qbIndex: 18, type:  3, transferMarket: true,  preRound:  0, note: "cup gameday" },
  { fileIndex: 29, qbIndex: 19, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 11" },
  { fileIndex: 30, qbIndex: 20, type:  3, transferMarket: true,  preRound:  0, note: "cup gameday" },
  { fileIndex: 31, qbIndex: 21, type:  2, transferMarket: true,  preRound:  2, note: "EHL gameday + cuparpo" },
  { fileIndex: 32, qbIndex: 22, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 12" },
  { fileIndex: 33, qbIndex: 23, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 13" },
  { fileIndex: 34, qbIndex: 24, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 14" },
  { fileIndex: 35, qbIndex: 25, type:  2, transferMarket: true,  preRound:  0, note: "EHL gameday" },
  { fileIndex: 36, qbIndex: 26, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 15" },
  { fileIndex: 37, qbIndex: 27, type: 96, transferMarket: true,  preRound:  0, note: "vapaa viikonloppu" },
  { fileIndex: 38, qbIndex: 28, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 16" },
  { fileIndex: 39, qbIndex: 29, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 17" },
  { fileIndex: 40, qbIndex: 30, type:  2, transferMarket: true,  preRound:  0, note: "EHL gameday" },
  { fileIndex: 41, qbIndex: 31, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 18" },
  { fileIndex: 42, qbIndex: 32, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 19" },
  { fileIndex: 43, qbIndex: 33, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 20" },
  { fileIndex: 44, qbIndex: 34, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 21" },
  { fileIndex: 45, qbIndex: 35, type:  3, transferMarket: true,  preRound:  0, note: "cup gameday" },
  { fileIndex: 46, qbIndex: 36, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 22" },
  { fileIndex: 47, qbIndex: 37, type: 98, transferMarket: true,  preRound:  0, note: "kutsuturnaus (Christmas invitation tournament window)" },
  { fileIndex: 48, qbIndex: 38, type: 97, transferMarket: true,  preRound:  0, note: "maajoukkuetauko" },
  { fileIndex: 49, qbIndex: 39, type:  1, transferMarket: true,  preRound:  5, note: "regular gameday 23 + suunnitelma (budget/planning)" },
  { fileIndex: 50, qbIndex: 40, type:  3, transferMarket: true,  preRound:  0, note: "cup gameday" },
  { fileIndex: 51, qbIndex: 41, type:  1, transferMarket: true,  preRound:  2, note: "regular gameday 24 + cuparpo" },
  { fileIndex: 52, qbIndex: 42, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 25" },
  { fileIndex: 53, qbIndex: 43, type:  1, transferMarket: true,  preRound: 10, note: "regular gameday 26 + mmkisaalku (WCh starts)" },
  { fileIndex: 54, qbIndex: 44, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 27" },
  { fileIndex: 55, qbIndex: 45, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 28" },
  { fileIndex: 56, qbIndex: 46, type: 22, transferMarket: true,  preRound: 11, note: "EHL final tournament + mmkisaloppu (WCh ends)" },
  { fileIndex: 57, qbIndex: 47, type:  1, transferMarket: true,  preRound:  0, note: "regular gameday 29 — last round with market open" },

  // ── Second half, market closed (kr 48..67) ───────────────────────────
  { fileIndex: 58, qbIndex: 48, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 30 — market closes here" },
  { fileIndex: 59, qbIndex: 49, type:  3, transferMarket: false, preRound:  0, note: "cup gameday" },
  { fileIndex: 60, qbIndex: 50, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 31" },
  { fileIndex: 61, qbIndex: 51, type:  3, transferMarket: false, preRound:  0, note: "cup gameday" },
  { fileIndex: 62, qbIndex: 52, type:  1, transferMarket: false, preRound:  2, note: "regular gameday 32 + cuparpo" },
  { fileIndex: 63, qbIndex: 53, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 33" },
  { fileIndex: 64, qbIndex: 54, type: 97, transferMarket: false, preRound:  0, note: "maajoukkuetauko" },
  { fileIndex: 65, qbIndex: 55, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 34" },
  { fileIndex: 66, qbIndex: 56, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 35" },
  { fileIndex: 67, qbIndex: 57, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 36" },
  { fileIndex: 68, qbIndex: 58, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 37" },
  { fileIndex: 69, qbIndex: 59, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 38" },
  { fileIndex: 70, qbIndex: 60, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 39" },
  { fileIndex: 71, qbIndex: 61, type:  3, transferMarket: false, preRound:  0, note: "cup gameday" },
  { fileIndex: 72, qbIndex: 62, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 40" },
  { fileIndex: 73, qbIndex: 63, type:  3, transferMarket: false, preRound:  0, note: "cup gameday" },
  { fileIndex: 74, qbIndex: 64, type:  1, transferMarket: false, preRound:  2, note: "regular gameday 41 + cuparpo" },
  { fileIndex: 75, qbIndex: 65, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 42" },
  { fileIndex: 76, qbIndex: 66, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 43" },
  { fileIndex: 77, qbIndex: 67, type:  1, transferMarket: false, preRound:  0, note: "regular gameday 44 — last regular gameday" },

  // ── Playoffs (kr 68..85) — best-of-5 across QF / SF / Final ──────────
  { fileIndex: 78, qbIndex: 68, type: 41, transferMarket: false, preRound:  0, note: "QF draw" },
  { fileIndex: 79, qbIndex: 69, type: 42, transferMarket: false, preRound:  0, note: "QF game 1" },
  { fileIndex: 80, qbIndex: 70, type: 42, transferMarket: false, preRound:  0, note: "QF game 2" },
  { fileIndex: 81, qbIndex: 71, type: 42, transferMarket: false, preRound:  0, note: "QF game 3" },
  { fileIndex: 82, qbIndex: 72, type: 42, transferMarket: false, preRound:  0, note: "QF game 4" },
  { fileIndex: 83, qbIndex: 73, type: 42, transferMarket: false, preRound:  0, note: "QF game 5" },
  { fileIndex: 84, qbIndex: 74, type: 43, transferMarket: false, preRound:  0, note: "SF draw" },
  { fileIndex: 85, qbIndex: 75, type: 44, transferMarket: false, preRound:  0, note: "SF game 1" },
  { fileIndex: 86, qbIndex: 76, type: 44, transferMarket: false, preRound:  0, note: "SF game 2" },
  { fileIndex: 87, qbIndex: 77, type: 44, transferMarket: false, preRound:  0, note: "SF game 3" },
  { fileIndex: 88, qbIndex: 78, type: 44, transferMarket: false, preRound:  0, note: "SF game 4" },
  { fileIndex: 89, qbIndex: 79, type: 44, transferMarket: false, preRound:  0, note: "SF game 5" },
  { fileIndex: 90, qbIndex: 80, type: 45, transferMarket: false, preRound:  0, note: "Final draw" },
  { fileIndex: 91, qbIndex: 81, type: 46, transferMarket: false, preRound:  0, note: "Final game 1" },
  { fileIndex: 92, qbIndex: 82, type: 46, transferMarket: false, preRound:  0, note: "Final game 2" },
  { fileIndex: 93, qbIndex: 83, type: 46, transferMarket: false, preRound:  0, note: "Final game 3" },
  { fileIndex: 94, qbIndex: 84, type: 46, transferMarket: false, preRound:  0, note: "Final game 4" },
  { fileIndex: 95, qbIndex: 85, type: 46, transferMarket: false, preRound:  0, note: "Final game 5" },

  // ── Cup final + season close (kr 86..89) ─────────────────────────────
  { fileIndex: 96, qbIndex: 86, type:  3, transferMarket: false, preRound:  0, note: "Pekkalan Cup final, leg 1" },
  { fileIndex: 97, qbIndex: 87, type:  3, transferMarket: false, preRound:  0, note: "Pekkalan Cup final, leg 2" },
  { fileIndex: 98, qbIndex: 88, type: 47, transferMarket: false, preRound:  2, note: "PHL juhlagaala (season-end gala) + cuparpo for next season" },
  { fileIndex: 99, qbIndex: 89, type: 48, transferMarket: false, preRound:  0, note: "uusikausi (rollover marker)" }
];
