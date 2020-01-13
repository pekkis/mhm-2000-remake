import countryData, { playerNames } from "../data/countries";
import { PlayableCountries } from "../types/country";
import random from "./random";
import { flip, invertObj } from "ramda";

interface LegacyIdToId {
  [key: number]: PlayableCountries;
}

interface IdToLegacyId {
  [key: string]: string;
}

const legacyIdToId: LegacyIdToId = {
  1: "FI",
  2: "SE",
  3: "DE",
  4: "IT",
  5: "RU",
  6: "CZ",
  7: "EE",
  8: "LV",
  9: "CA",
  10: "US",
  11: "CH",
  12: "SK",
  13: "JP",
  14: "NO",
  15: "FR",
  16: "AT",
  17: "PL"
};

const idToLegacyId: IdToLegacyId = invertObj(legacyIdToId);

const initialLetters = [
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

export const countryFromLegacyCountry = (legacyId: number): PlayableCountries =>
  legacyIdToId[legacyId];

export const legacyCountryFromCountry = (id: string): number =>
  parseInt(idToLegacyId[id.toString()], 10) - 1;

export const getData = () => countryData;

export const createLastName = (country: PlayableCountries) => {
  return random.pick(playerNames[country]);
};

export const createFirstName = (country: PlayableCountries) => {
  if (country === "FI") {
    return random.pick(initialLetters, 0, 15);
  }

  return random.pick(initialLetters);
};
