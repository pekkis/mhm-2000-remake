import {
  ForEveryCountry,
  NameList,
  ForEveryPlayableCountry
} from "../types/country";

import fiNames from "./country/players-FI";
import seNames from "./country/players-SE";
import deNames from "./country/players-DE";
import usNames from "./country/players-US";
import caNames from "./country/players-CA";
import chNames from "./country/players-CH";
import lvNames from "./country/players-LV";

import atNames from "./country/players-AT";
import czNames from "./country/players-CZ";
import frNames from "./country/players-FR";
import itNames from "./country/players-IT";
import jpNames from "./country/players-JP";
import ruNames from "./country/players-RU";
import skNames from "./country/players-SK";

import eeNames from "./country/players-SK";
import noNames from "./country/players-NO";
import plNames from "./country/players-PL";

export interface CountryData {
  iso: string;
  name: string;
  special: boolean;
  strength: () => number;
}

export const playerNames: ForEveryPlayableCountry<NameList> = {
  FI: fiNames,
  SE: seNames,
  DE: deNames,
  CA: caNames,
  CH: chNames,
  US: usNames,
  AT: atNames,
  CZ: czNames,
  IT: itNames,
  SK: skNames,
  RU: ruNames,
  JP: jpNames,
  FR: frNames,
  LV: lvNames,
  EE: eeNames,
  PL: plNames,
  NO: noNames
};

const countryData: ForEveryCountry<CountryData> = {
  FI: {
    special: false,
    iso: "FI",
    name: "Pekkalandia",
    strength: function() {
      return 0;
    }
  },
  EE: {
    special: false,
    iso: "EE",
    name: "Viro",
    strength: () => 66
  },
  CA: {
    special: false,
    iso: "CA",
    name: "Kanada",
    strength: () => 202
  },
  US: {
    special: false,
    iso: "US",
    name: "Yhdysvallat",
    strength: () => 194
  },
  SE: {
    special: false,
    iso: "SE",
    name: "Ruotsi",
    strength: () => 206
  },
  FR: {
    special: false,
    iso: "FR",
    name: "Ranska",
    strength: () => 153
  },
  CZ: {
    special: false,
    iso: "CZ",
    name: "Tshekki",
    strength: () => 208
  },
  SK: {
    special: false,
    iso: "SK",
    name: "Slovakia",
    strength: () => 189
  },
  RU: {
    special: false,
    iso: "RU",
    name: "Venäjä",
    strength: () => 211
  },
  DE: {
    special: false,
    iso: "DE",
    name: "Saksa",
    strength: () => 170
  },
  LV: {
    special: false,
    iso: "LV",
    name: "Latvia",
    strength: () => 163
  },
  IT: {
    special: false,
    iso: "IT",
    name: "Italia",
    strength: () => 168
  },
  CH: {
    special: false,
    iso: "CH",
    name: "Sveitsi",
    strength: () => 159
  },
  JP: {
    special: false,
    iso: "JP",
    name: "Japani",
    strength: () => 66
  },
  NO: {
    special: false,
    iso: "NO",
    name: "Norja",
    strength: () => 66
  },
  AT: {
    special: false,
    iso: "AT",
    name: "Itävalta",
    strength: () => 66
  },
  PL: {
    special: false,
    iso: "PL",
    name: "Puola",
    strength: () => 66
  },
  BR: {
    special: true,
    iso: "BR",
    name: "Brasilia",
    strength: () => 66
  },
  ZW: {
    special: true,
    iso: "ZW",
    name: "Zimbabwe",
    strength: () => 66
  },
  ES: {
    special: true,
    iso: "ES",
    name: "Espanja",
    strength: () => 66
  },
  "??": {
    special: true,
    iso: "??",
    name: "Tuntematon",
    strength: () => 999
  },
  KP: {
    special: true,
    iso: "KP",
    name: "Pohjois-Korea",
    strength: () => 999
  }
};

export default countryData;
