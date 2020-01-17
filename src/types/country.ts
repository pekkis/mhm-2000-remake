import { ForEvery } from "./base";

export type NameList = string[];

export type PlayableCountries =
  | "FI"
  | "SE"
  | "DE"
  | "IT"
  | "RU"
  | "CZ"
  | "EE"
  | "LV"
  | "CA"
  | "US"
  | "CH"
  | "SK"
  | "JP"
  | "NO"
  | "FR"
  | "AT"
  | "PL";

export type AllCountries = PlayableCountries | SpecialCountries;

export type SpecialCountries =
  | "??"
  | "ES"
  | "ZW"
  | "ES"
  | "BR"
  | "KP"
  | "GB"
  | "GR"
  | "IE"
  | "BE"
  | "DK"
  | "NL";

export type ForEveryCountry<T> = ForEvery<AllCountries, T>;

export type ForEveryPlayableCountry<T> = ForEvery<PlayableCountries, T>;

export interface Country {
  iso: string;
  name: string;
  strength: number;
}
/*
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
  "PL",
  "BR",
  "ZW",
  "??",
  "KP"
];
*/
