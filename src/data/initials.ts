// Player first-initial pools.
//
// Sourced verbatim from `src/mhm2000-qb/DATA/DATAX.M2K` records 41..63
// (the `krjn(1..23)` array, 23 single letters loaded by the bundle
// reader at [MHM2K.BAS:813](../mhm2000-qb/MHM2K.BAS)).
//
// In the QB original ([YHTEIS.BAS:1](../mhm2000-qb/YHTEIS.BAS) `SUB rela`,
// duplicated in MHM2K.BAS / ILEX5.BAS / ILEZ5.BAS) the first initial
// is rolled like:
//
//     IF nats = 1 THEN krj$ = krjn(INT(16 * RND) + 1) ELSE krj$ = krjn(INT(23 * RND) + 1)
//
// Then the player name is composed as `<initial>.<surname>`, e.g.
// `K.Hirvikoski`. So Pekkalandian players draw from the first 16
// letters; foreigners draw from the full 23 (the extra 7 are
// `C D B W Z G F`, the ones perceived as more "foreign" in the
// original Finnish naming convention).
//
// Note: X, Q and V are deliberately absent from both pools.

export const initialsAll: readonly string[] = [
  "A",
  "E",
  "I",
  "O",
  "U",
  "Y",
  "R",
  "T",
  "P",
  "S",
  "H",
  "J",
  "K",
  "L",
  "N",
  "M",
  "C",
  "D",
  "B",
  "W",
  "Z",
  "G",
  "F"
];

/** First 16 entries of `initialsAll`. Used for Pekkalandian (FI) players. */
export const initialsPekkalandian: readonly string[] = initialsAll.slice(0, 16);

/** Full 23 entries. Used for every non-FI nationality. */
export const initialsForeign: readonly string[] = initialsAll;

export function initialsFor(iso: string): readonly string[] {
  return iso === "FI" ? initialsPekkalandian : initialsForeign;
}
