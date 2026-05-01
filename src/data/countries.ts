import type { CountrySeries } from "@/state/country";

type Country = {
  iso: string;
  name: string;
  series: CountrySeries;
  level: number;
  strength: () => number | undefined;
};

// Sourced from src/mhm2000-qb/DATA/KANSAT.M2K.
// Columns: name, QB 3-letter code (dropped — we key by ISO 3166-1 alpha-2),
// series (1=A, 2=B, 3=non-participant), level (39 has some yet-unknown
// special meaning, currently used as a sentinel for series "c").
//
// Strengths preserved from MHM 97 where they existed; new countries
// (and Pekkalandia) get a placeholder 111 — to be replaced once we port
// the proper national-strength simulation.
const countriesArray: Country[] = [
  {
    iso: "FI",
    name: "Pekkalandia",
    series: "a",
    level: 14,
    strength: () => undefined
  },
  {
    iso: "SE",
    name: "Ruotsi",
    series: "a",
    level: 14,
    strength: () => 206
  },
  {
    iso: "DE",
    name: "Saksa",
    series: "b",
    level: 9,
    strength: () => 170
  },
  {
    iso: "IT",
    name: "Italia",
    series: "a",
    level: 10,
    strength: () => 168
  },
  {
    iso: "RU",
    name: "Venäjä",
    series: "a",
    level: 14,
    strength: () => 211
  },
  {
    iso: "CZ",
    name: "Tsekki",
    series: "a",
    level: 14,
    strength: () => 208
  },
  {
    iso: "EE",
    name: "Eesti",
    series: "b",
    level: 8,
    strength: () => 111
  },
  {
    iso: "LV",
    name: "Latvia",
    series: "a",
    level: 11,
    strength: () => 163
  },
  {
    iso: "CA",
    name: "Kanada",
    series: "a",
    level: 13,
    strength: () => 202
  },
  {
    iso: "US",
    name: "Yhdysvallat",
    series: "a",
    level: 13,
    strength: () => 194
  },
  {
    iso: "CH",
    name: "Sveitsi",
    series: "a",
    level: 11,
    strength: () => 159
  },
  {
    iso: "SK",
    name: "Slovakia",
    series: "a",
    level: 13,
    strength: () => 189
  },
  {
    iso: "JP",
    name: "Japani",
    series: "b",
    level: 9,
    strength: () => 111
  },
  {
    iso: "NO",
    name: "Norja",
    series: "b",
    level: 10,
    strength: () => 111
  },
  {
    iso: "FR",
    name: "Ranska",
    series: "b",
    level: 10,
    strength: () => 153
  },
  {
    iso: "AT",
    name: "Itävalta",
    series: "b",
    level: 10,
    strength: () => 111
  },
  {
    iso: "PL",
    name: "Puola",
    series: "b",
    level: 10,
    strength: () => 111
  },
  {
    iso: "BR",
    name: "Brasilia",
    series: "c",
    level: 39,
    strength: () => 111
  },
  {
    iso: "ZW",
    name: "Zimbabwe",
    series: "c",
    level: 39,
    strength: () => 111
  },
  {
    iso: "ES",
    name: "Espanja",
    series: "c",
    level: 39,
    strength: () => 111
  },
  {
    // QB code "???" — `TUNTEMATON` (= "unknown"). XX is the ISO 3166
    // user-assigned escape we'll co-opt for the unknown bucket.
    iso: "XX",
    name: "Tuntematon",
    series: "c",
    level: 39,
    strength: () => 111
  },
  {
    iso: "KP",
    name: "Pohjois-Korea",
    series: "c",
    level: 39,
    strength: () => 111
  }
];

type CountriesMap = Record<string, Country>;

export const countries: CountriesMap = Object.fromEntries(
  countriesArray.map((c) => [c.iso, c])
) as CountriesMap;

export { countriesArray };
