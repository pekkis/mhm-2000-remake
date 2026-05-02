import { countriesArray, type CountryIso } from "@/data/countries";

/**
 * Mapping from the QB nationality index (1-based, matches row order in
 * `src/mhm2000-qb/DATA/KANSAT.M2K`) to the 2-letter ISO 3166-1 alpha-2
 * code we use throughout the remake.
 *
 * The original data files (MANAGERS.M2K, *.MHX, TEAMS.*) reference
 * nationalities by these legacy integers; we translate at the
 * import boundary and then never speak QB-numerics again.
 *
 * The order below is the literal order of KANSAT.M2K. Do not reorder
 * — that's the contract.
 */
const legacyNationalityIsoOrder: readonly CountryIso[] = [
  "FI", // 1  PEKKALANDIA
  "SE", // 2  RUOTSI
  "DE", // 3  SAKSA
  "IT", // 4  ITALIA
  "RU", // 5  VENÄJÄ
  "CZ", // 6  TSEKKI
  "EE", // 7  EESTI
  "LV", // 8  LATVIA
  "CA", // 9  KANADA
  "US", // 10 YHDYSVALLAT
  "CH", // 11 SVEITSI
  "SK", // 12 SLOVAKIA
  "JP", // 13 JAPANI
  "NO", // 14 NORJA
  "FR", // 15 RANSKA
  "AT", // 16 ITÄVALTA
  "PL", // 17 PUOLA
  "BR", // 18 BRASILIA
  "ZW", // 19 ZIMBABWE
  "ES", // 20 ESPANJA
  "XX", // 21 TUNTEMATON
  "KP" // 22 POHJOIS-KOREA
];

/** Build the reverse lookup once, statically. */
const legacyIdByIso: Record<string, number> = Object.fromEntries(
  legacyNationalityIsoOrder.map((iso, i) => [iso, i + 1])
);

export function legacyNationalityToIso(legacyId: number): CountryIso {
  const iso = legacyNationalityIsoOrder[legacyId - 1];
  if (iso === undefined) {
    throw new Error(
      `Unknown legacy nationality id ${legacyId} (expected 1..${legacyNationalityIsoOrder.length})`
    );
  }
  return iso;
}

export function isoToLegacyNationality(iso: string): number {
  const id = legacyIdByIso[iso];
  if (id === undefined) {
    throw new Error(`No legacy nationality id for ISO ${iso}`);
  }
  return id;
}

/**
 * Sanity check at module-load time: every ISO referenced by the
 * legacy table must exist in the canonical countries list.
 */
const knownIsos = new Set(countriesArray.map((c) => c.iso));
for (const iso of legacyNationalityIsoOrder) {
  if (!knownIsos.has(iso)) {
    throw new Error(
      `Legacy nationality table references unknown ISO ${iso}; add it to data/countries.ts`
    );
  }
}
