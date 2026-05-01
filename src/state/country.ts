/**
 * World championship tier the country participates in.
 * - `a` — A-sarja (top division)
 * - `b` — B-sarja
 * - `c` — does not participate
 *
 * Maps to KANSAT.M2K column 3 (1/2/3).
 */
export type CountrySeries = "a" | "b" | "c";

export type Country = {
  /** 2-letter ISO 3166-1 alpha-2 code (consolidated; replaces QB's 3-letter codes). */
  iso: string;
  name: string;
  series: CountrySeries;
  /** General national level. KANSAT.M2K column 4. The sentinel value 39 has some yet-undecoded meaning. */
  level: number;
  strength: number | undefined;
};

export type CountryState = {
  countries: Record<string, Country>;
};
