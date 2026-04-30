type Country = {
  iso: string;
  name: string;
  strength: () => number | undefined;
};

const countriesArray: Country[] = [
  {
    iso: "FI",
    name: "Pekkalandia",
    strength: () => undefined
  },
  {
    iso: "CA",
    name: "Kanada",
    strength: () => 202
  },
  {
    iso: "US",
    name: "Yhdysvallat",
    strength: () => 194
  },
  {
    iso: "SE",
    name: "Ruotsi",
    strength: () => 206
  },
  {
    iso: "FR",
    name: "Ranska",
    strength: () => 153
  },
  {
    iso: "CZ",
    name: "Tshekki",
    strength: () => 208
  },
  {
    iso: "SK",
    name: "Slovakia",
    strength: () => 189
  },
  {
    iso: "RU",
    name: "Venäjä",
    strength: () => 211
  },
  {
    iso: "DE",
    name: "Saksa",
    strength: () => 170
  },
  {
    iso: "LV",
    name: "Latvia",
    strength: () => 163
  },
  {
    iso: "IT",
    name: "Italia",
    strength: () => 168
  },
  {
    iso: "CH",
    name: "Sveitsi",
    strength: () => 159
  }
];

type CountriesMap = Record<string, Country>;

export const countries: CountriesMap = Object.fromEntries(
  countriesArray.map((c) => [c.iso, c])
) as CountriesMap;

export { countriesArray };
