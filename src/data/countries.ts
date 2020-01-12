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
    iso: "FI",
    name: "Pekkalandia",
    strength: function() {
      return 0;
    }
  },
  EE: {
    iso: "EE",
    name: "Viro",
    strength: () => 66
  },
  CA: {
    iso: "CA",
    name: "Kanada",
    strength: () => 202
  },
  US: {
    iso: "US",
    name: "Yhdysvallat",
    strength: () => 194
  },
  SE: {
    iso: "SE",
    name: "Ruotsi",
    strength: () => 206
  },
  FR: {
    iso: "FR",
    name: "Ranska",
    strength: () => 153
  },
  CZ: {
    iso: "CZ",
    name: "Tshekki",
    strength: () => 208
  },
  SK: {
    iso: "SK",
    name: "Slovakia",
    strength: () => 189
  },
  RU: {
    iso: "RU",
    name: "Venäjä",
    strength: () => 211
  },
  DE: {
    iso: "DE",
    name: "Saksa",
    strength: () => 170
  },
  LV: {
    iso: "LV",
    name: "Latvia",
    strength: () => 163
  },
  IT: {
    iso: "IT",
    name: "Italia",
    strength: () => 168
  },
  CH: {
    iso: "CH",
    name: "Sveitsi",
    strength: () => 159
  },
  JP: {
    iso: "JP",
    name: "Japani",
    strength: () => 66
  },
  NO: {
    iso: "NO",
    name: "Norja",
    strength: () => 66
  },
  AT: {
    iso: "AT",
    name: "Itävalta",
    strength: () => 66
  },
  PL: {
    iso: "PL",
    name: "Puola",
    strength: () => 66
  },
  BR: {
    iso: "BR",
    name: "Brasilia",
    strength: () => 66
  },
  ZW: {
    iso: "ZW",
    name: "Zimbabwe",
    strength: () => 66
  },
  ES: {
    iso: "ES",
    name: "Espanja",
    strength: () => 66
  },
  "??": {
    iso: "??",
    name: "Tuntematon",
    strength: () => 999
  },
  KP: {
    iso: "KP",
    name: "Pohjois-Korea",
    strength: () => 999
  }
};

export default countryData;
