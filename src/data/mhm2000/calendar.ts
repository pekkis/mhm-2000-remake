/**
 * Decoded MHM 2000 calendar (`KIERO.M2K`).
 *
 * Source: src/mhm2000-qb/DATA/KIERO.M2K — 99 records, three CSV columns
 * (`kiero`, `kiero2`, `kiero3`). Loaded by `MHM2K.BAS:914` into
 * `kiero(-9..89)` etc.
 *
 * This file is the source of truth for the MHM 2000 calendar. The QB
 * source uses array indices -9..89 (preseason starts at -9, regular
 * season at 1). We use a clean 0..98 indexing instead. `fileIndex` is
 * preserved 1-based for unambiguous cross-reference back to KIERO.M2K.
 *
 * The runtime calendar is built from this table by
 * `src/data/mhm2000/parse-calendar.ts`. Iterate on the parser, not on
 * this file — this is *the* canonical decoded input.
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
 *  other "while market is open" branches.
 *
 *  ## kiero3 — pre-round one-shot SUB trigger (0 = none)
 *  Fired before the round's main action.
 *  | code | SUB                                  |
 *  |------|--------------------------------------|
 *  |   1  | valitsestrat + tremaar (strategy)    |
 *  |   2  | cuparpo (cup draw)                   |
 *  |   3  | UNIDENTIFIED — qbIndex 11..13        |
 *  |   4  | börsi init + bulk transfer-market gen + cuparpo |
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
  /** 0-based round index used by the runtime engine. */
  index: number;
  /** 1-based KIERO.M2K row index for unambiguous source cross-reference. */
  fileIndex: number;
  /** kiero — round type. */
  type: RoundType;
  /** kiero2 — transfer market open. */
  transferMarket: boolean;
  /** kiero3 — pre-round one-shot SUB. 0 = none. */
  preRound: PreRoundTrigger;
  /**
   * Free-form annotations: open questions, things still TODO, points
   * of interest. Surfaces in the parsed `CalendarEntry` so we can grep
   * for them later. Use kebab-case strings, e.g. `"unknown:preRound=3"`,
   * `"todo:wire-budget"`, `"poi:mass-bors-gen"`.
   */
  tags: string[];
  /** Human-readable label. */
  note: string;
};

// prettier-ignore
export const rawCalendar: RawCalendarEntry[] = [
  // ── Preseason ────────────────────────────────────────────────────────
  { index:  0, fileIndex:  1, type: 99, transferMarket: true,  preRound:  4, tags: ["preseason", "preRound:bors-init", "preRound:cup-draw", "todo:wire-bors-mass-gen"],     note: "preseason: transfer market opens, mass börsi generation + cup draw" },
  { index:  1, fileIndex:  2, type: 99, transferMarket: true,  preRound: 99, tags: ["preseason", "preRound:sponsorit", "todo:wire-sponsorit"],                              note: "preseason: sponsorit (sponsor draw)" },
  { index:  2, fileIndex:  3, type: 99, transferMarket: true,  preRound:  0, tags: ["preseason"],                                                                          note: "preseason filler" },
  { index:  3, fileIndex:  4, type: 99, transferMarket: true,  preRound:  0, tags: ["preseason"],                                                                          note: "preseason filler" },
  { index:  4, fileIndex:  5, type: 99, transferMarket: true,  preRound:  0, tags: ["preseason"],                                                                          note: "preseason filler" },
  { index:  5, fileIndex:  6, type: 99, transferMarket: true,  preRound:  0, tags: ["preseason"],                                                                          note: "preseason filler" },
  { index:  6, fileIndex:  7, type:  4, transferMarket: true,  preRound:  0, tags: ["preseason", "training", "todo:wire-practice-competition"],                            note: "training match" },
  { index:  7, fileIndex:  8, type:  4, transferMarket: true,  preRound:  1, tags: ["preseason", "training", "preRound:strategy-selection"],                               note: "training match: valitsestrat (strategy selection)" },
  { index:  8, fileIndex:  9, type:  4, transferMarket: true,  preRound:  6, tags: ["preseason", "training", "preRound:tactics"],                                          note: "training match: tremaar (tactics refresh)" },
  { index:  9, fileIndex: 10, type:  4, transferMarket: true,  preRound: 49, tags: ["preseason", "training", "preRound:season-opening-gala", "todo:wire-opening-gala"],    note: "training match: zreseasongala (season-opening gala)" },

  // ── First half of regular season, market open ────────────────────────
  { index: 10, fileIndex: 11, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 1" },
  { index: 11, fileIndex: 12, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 2" },
  { index: 12, fileIndex: 13, type:  3, transferMarket: true,  preRound:  0, tags: ["todo:wire-cup-competition"],                                                           note: "cup gameday" },
  { index: 13, fileIndex: 14, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 3" },
  { index: 14, fileIndex: 15, type:  3, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "cup gameday" },
  { index: 15, fileIndex: 16, type:  2, transferMarket: true,  preRound:  2, tags: ["preRound:cup-draw"],                                                                  note: "EHL gameday + cuparpo (cup draw)" },
  { index: 16, fileIndex: 17, type: 96, transferMarket: true,  preRound:  0, tags: ["free-weekend"],                                                                       note: "vapaa viikonloppu (free weekend)" },
  { index: 17, fileIndex: 18, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 4" },
  { index: 18, fileIndex: 19, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 5" },
  { index: 19, fileIndex: 20, type:  2, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "EHL gameday" },
  { index: 20, fileIndex: 21, type:  1, transferMarket: true,  preRound:  3, tags: ["unknown:preRound=3"],                                                                 note: "regular gameday 6 + UNKNOWN kiero3=3" },
  { index: 21, fileIndex: 22, type:  1, transferMarket: true,  preRound:  3, tags: ["unknown:preRound=3"],                                                                 note: "regular gameday 7 + UNKNOWN kiero3=3" },
  { index: 22, fileIndex: 23, type:  1, transferMarket: true,  preRound:  3, tags: ["unknown:preRound=3"],                                                                 note: "regular gameday 8 + UNKNOWN kiero3=3" },
  { index: 23, fileIndex: 24, type:  2, transferMarket: true,  preRound:  7, tags: ["preRound:nhl-champion-check", "todo:wire-nhl-champion-check"],                        note: "EHL gameday + tarkistanhlc (NHL champion check)" },
  { index: 24, fileIndex: 25, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 9" },
  { index: 25, fileIndex: 26, type: 97, transferMarket: true,  preRound:  0, tags: ["national-team-break"],                                                                note: "maajoukkuetauko (national team break)" },
  { index: 26, fileIndex: 27, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 10" },
  { index: 27, fileIndex: 28, type:  3, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "cup gameday" },
  { index: 28, fileIndex: 29, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 11" },
  { index: 29, fileIndex: 30, type:  3, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "cup gameday" },
  { index: 30, fileIndex: 31, type:  2, transferMarket: true,  preRound:  2, tags: ["preRound:cup-draw"],                                                                  note: "EHL gameday + cuparpo" },
  { index: 31, fileIndex: 32, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 12" },
  { index: 32, fileIndex: 33, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 13" },
  { index: 33, fileIndex: 34, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 14" },
  { index: 34, fileIndex: 35, type:  2, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "EHL gameday" },
  { index: 35, fileIndex: 36, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 15" },
  { index: 36, fileIndex: 37, type: 96, transferMarket: true,  preRound:  0, tags: ["free-weekend"],                                                                       note: "vapaa viikonloppu" },
  { index: 37, fileIndex: 38, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 16" },
  { index: 38, fileIndex: 39, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 17" },
  { index: 39, fileIndex: 40, type:  2, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "EHL gameday" },
  { index: 40, fileIndex: 41, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 18" },
  { index: 41, fileIndex: 42, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 19" },
  { index: 42, fileIndex: 43, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 20" },
  { index: 43, fileIndex: 44, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 21" },
  { index: 44, fileIndex: 45, type:  3, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "cup gameday" },
  { index: 45, fileIndex: 46, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 22" },
  { index: 46, fileIndex: 47, type: 98, transferMarket: true,  preRound:  0, tags: ["invitation-tournaments", "christmas"],                                                note: "kutsuturnaus (Christmas invitation tournaments window)" },
  { index: 47, fileIndex: 48, type: 97, transferMarket: true,  preRound:  0, tags: ["national-team-break"],                                                                note: "maajoukkuetauko" },
  { index: 48, fileIndex: 49, type:  1, transferMarket: true,  preRound:  5, tags: ["preRound:budget", "todo:wire-budget"],                                                note: "regular gameday 23 + suunnitelma (budget / planning)" },
  { index: 49, fileIndex: 50, type:  3, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "cup gameday" },
  { index: 50, fileIndex: 51, type:  1, transferMarket: true,  preRound:  2, tags: ["preRound:cup-draw"],                                                                  note: "regular gameday 24 + cuparpo" },
  { index: 51, fileIndex: 52, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 25" },
  { index: 52, fileIndex: 53, type:  1, transferMarket: true,  preRound: 10, tags: ["preRound:wch-start", "todo:wire-world-championships"],                                note: "regular gameday 26 + mmkisaalku (WCh starts)" },
  { index: 53, fileIndex: 54, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 27" },
  { index: 54, fileIndex: 55, type:  1, transferMarket: true,  preRound:  0, tags: [],                                                                                      note: "regular gameday 28" },
  { index: 55, fileIndex: 56, type: 22, transferMarket: true,  preRound: 11, tags: ["ehl-final-tournament", "preRound:wch-end"],                                           note: "EHL final tournament + mmkisaloppu (WCh ends)" },
  { index: 56, fileIndex: 57, type:  1, transferMarket: true,  preRound:  0, tags: ["last-round-with-market-open"],                                                        note: "regular gameday 29 — last round with market open" },

  // ── Second half, market closed ───────────────────────────────────────
  { index: 57, fileIndex: 58, type:  1, transferMarket: false, preRound:  0, tags: ["market-closes-here"],                                                                 note: "regular gameday 30 — market just closed" },
  { index: 58, fileIndex: 59, type:  3, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "cup gameday" },
  { index: 59, fileIndex: 60, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 31" },
  { index: 60, fileIndex: 61, type:  3, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "cup gameday" },
  { index: 61, fileIndex: 62, type:  1, transferMarket: false, preRound:  2, tags: ["preRound:cup-draw"],                                                                  note: "regular gameday 32 + cuparpo" },
  { index: 62, fileIndex: 63, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 33" },
  { index: 63, fileIndex: 64, type: 97, transferMarket: false, preRound:  0, tags: ["national-team-break"],                                                                note: "maajoukkuetauko" },
  { index: 64, fileIndex: 65, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 34" },
  { index: 65, fileIndex: 66, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 35" },
  { index: 66, fileIndex: 67, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 36" },
  { index: 67, fileIndex: 68, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 37" },
  { index: 68, fileIndex: 69, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 38" },
  { index: 69, fileIndex: 70, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 39" },
  { index: 70, fileIndex: 71, type:  3, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "cup gameday" },
  { index: 71, fileIndex: 72, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 40" },
  { index: 72, fileIndex: 73, type:  3, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "cup gameday" },
  { index: 73, fileIndex: 74, type:  1, transferMarket: false, preRound:  2, tags: ["preRound:cup-draw"],                                                                  note: "regular gameday 41 + cuparpo" },
  { index: 74, fileIndex: 75, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 42" },
  { index: 75, fileIndex: 76, type:  1, transferMarket: false, preRound:  0, tags: [],                                                                                      note: "regular gameday 43" },
  { index: 76, fileIndex: 77, type:  1, transferMarket: false, preRound:  0, tags: ["last-regular-gameday"],                                                               note: "regular gameday 44 — last regular gameday" },

  // ── Playoffs — best-of-5 across QF / SF / Final ──────────────────────
  { index: 77, fileIndex: 78, type: 41, transferMarket: false, preRound:  0, tags: ["playoffs", "playoff-draw"],                                                           note: "QF draw" },
  { index: 78, fileIndex: 79, type: 42, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "QF game 1" },
  { index: 79, fileIndex: 80, type: 42, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "QF game 2" },
  { index: 80, fileIndex: 81, type: 42, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "QF game 3" },
  { index: 81, fileIndex: 82, type: 42, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "QF game 4" },
  { index: 82, fileIndex: 83, type: 42, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "QF game 5" },
  { index: 83, fileIndex: 84, type: 43, transferMarket: false, preRound:  0, tags: ["playoffs", "playoff-draw"],                                                           note: "SF draw" },
  { index: 84, fileIndex: 85, type: 44, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "SF game 1" },
  { index: 85, fileIndex: 86, type: 44, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "SF game 2" },
  { index: 86, fileIndex: 87, type: 44, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "SF game 3" },
  { index: 87, fileIndex: 88, type: 44, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "SF game 4" },
  { index: 88, fileIndex: 89, type: 44, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "SF game 5" },
  { index: 89, fileIndex: 90, type: 45, transferMarket: false, preRound:  0, tags: ["playoffs", "playoff-draw"],                                                           note: "Final draw" },
  { index: 90, fileIndex: 91, type: 46, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "Final game 1" },
  { index: 91, fileIndex: 92, type: 46, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "Final game 2" },
  { index: 92, fileIndex: 93, type: 46, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "Final game 3" },
  { index: 93, fileIndex: 94, type: 46, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "Final game 4" },
  { index: 94, fileIndex: 95, type: 46, transferMarket: false, preRound:  0, tags: ["playoffs"],                                                                           note: "Final game 5" },

  // ── Cup final + season close ─────────────────────────────────────────
  { index: 95, fileIndex: 96, type:  3, transferMarket: false, preRound:  0, tags: ["cup-final-leg-1"],                                                                    note: "Pekkalan Cup final, leg 1" },
  { index: 96, fileIndex: 97, type:  3, transferMarket: false, preRound:  0, tags: ["cup-final-leg-2"],                                                                    note: "Pekkalan Cup final, leg 2" },
  { index: 97, fileIndex: 98, type: 47, transferMarket: false, preRound:  2, tags: ["season-end-gala", "preRound:cup-draw"],                                               note: "PHL juhlagaala (season-end gala) + cuparpo for next season" },
  { index: 98, fileIndex: 99, type: 48, transferMarket: false, preRound:  0, tags: ["season-rollover"],                                                                    note: "uusikausi (rollover marker)" }
];
