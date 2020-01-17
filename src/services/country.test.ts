import { createLastName, createFirstName } from "./country";
import { PlayableCountries } from "../types/country";

const countries = [
  "FI",
  "SE",
  "DE",
  "IT",
  "RU",
  "CZ",
  "EE",
  "LV",
  "CA",
  "US",
  "CH",
  "SK",
  "JP",
  "NO",
  "FR",
  "AT",
  "PL"
];

test("creates last name for each country", () => {
  countries.forEach(iso => {
    const lastName = createLastName(iso as PlayableCountries);
    expect(typeof lastName).toBe("string");
  });
});

test("creates first name as initial letter for each country", () => {
  countries.forEach(iso => {
    const firstName = createFirstName(iso as PlayableCountries);
    expect(typeof firstName).toBe("string");
    expect(firstName).toHaveLength(1);
  });
});
