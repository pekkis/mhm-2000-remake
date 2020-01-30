import { mapIndexed } from "ramda-adjunct";
import { Team } from "../../types/team";
import uuid from "uuid";
import { indexBy, prop, pipe, toPairs, map, fromPairs } from "ramda";
import { AllCountries } from "../../types/country";
import { nameToId } from "../team";

interface TeamData {
  name: string;
  city: string;
  level: number;
  country: AllCountries;
}

const teamList: TeamData[] = [
  { name: "TPS", city: "Turku", level: 34, country: "FI" },
  { name: "HIFK", city: "Helsinki", level: 31, country: "FI" },
  { name: "HPK", city: "Hämeenlinna", level: 33, country: "FI" },
  { name: "SaiPa", city: "Lappeenranta", level: 30, country: "FI" },
  { name: "Jokerit", city: "Helsinki", level: 32, country: "FI" },
  { name: "Ilves", city: "Tampere", level: 31, country: "FI" },
  { name: "Blues", city: "Espoo", level: 33, country: "FI" },
  { name: "JYP", city: "Jyväskylä", level: 30, country: "FI" },
  { name: "Tappara", city: "Tampere", level: 33, country: "FI" },
  { name: "Ässät", city: "Pori", level: 30, country: "FI" },
  { name: "Lukko", city: "Rauma", level: 32, country: "FI" },
  { name: "Pelicans", city: "Lahti", level: 29, country: "FI" },

  { name: "Kärpät", city: "Oulu", level: 30, country: "FI" },
  { name: "Hermes", city: "Kokkola", level: 25, country: "FI" },
  { name: "TuTo", city: "Turku", level: 27, country: "FI" },
  { name: "FPS", city: "Forssa", level: 23, country: "FI" },
  { name: "Diskos", city: "Jyväskylä", level: 24, country: "FI" },
  { name: "Sport", city: "Vaasa", level: 27, country: "FI" },
  { name: "SaPKo", city: "Savonlinna", level: 22, country: "FI" },
  { name: "Jokipojat", city: "Joensuu", level: 24, country: "FI" },
  { name: "KJT", city: "Järvenpää", level: 22, country: "FI" },
  { name: "Ahmat", city: "Hyvinkää", level: 23, country: "FI" },
  { name: "Jääkotkat", city: "Uusikaupunki", level: 24, country: "FI" },
  { name: "Jukurit", city: "Mikkeli", level: 18, country: "FI" },

  { name: "VG-62", city: "Naantali", level: 17, country: "FI" },
  { name: "Testicles", city: "Kivesjärvi", level: 18, country: "FI" },
  { name: "SantaClaus", city: "Rovaniemi", level: 16, country: "FI" },
  { name: "Ruiske", city: "Tiukukoski", level: 19, country: "FI" },
  { name: "Lightning", city: "Kerava", level: 18, country: "FI" },
  { name: "Nikkarit", city: "Riihimäki", level: 18, country: "FI" },
  { name: "Salama", city: "Sompio", level: 16, country: "FI" },
  { name: "Hait", city: "Nuuksio", level: 16, country: "FI" },
  { name: "Mahti", city: "Mäntsälä", level: 15, country: "FI" },
  { name: "Siat", city: "Syväri", level: 14, country: "FI" },
  { name: "Veto", city: "Töysä", level: 18, country: "FI" },
  { name: "Ikirouta", city: "Inari", level: 15, country: "FI" },
  { name: "Jymy", city: "Sotkamo", level: 13, country: "FI" },
  { name: "Hokki", city: "Kajaani", level: 18, country: "FI" },
  { name: "Voitto", city: "Kangasala", level: 18, country: "FI" },
  { name: "Teurastus", city: "Porvoo", level: 18, country: "FI" },
  { name: "KoMu HT", city: "Korsholm", level: 14, country: "FI" },
  { name: "Saappaat", city: "Nokia", level: 18, country: "FI" },
  { name: "Aromi", city: "Valkeakoski", level: 18, country: "FI" },
  { name: "Gepardit", city: "Klaukkala", level: 22, country: "FI" },
  { name: "KooKoo", city: "Kouvola", level: 24, country: "FI" },
  { name: "HardCore", city: "Loimaa", level: 22, country: "FI" },
  { name: "Turmio", city: "Kolari", level: 35, country: "FI" },
  { name: "KalPa", city: "Kuopio", level: 21, country: "FI" },

  { name: "Enkelit", city: "Helvetti", level: 12, country: "FI" },
  { name: "Maila", city: "Nurmijärvi", level: 12, country: "FI" },
  { name: "Sopupallo", city: "Juva", level: 11, country: "FI" },
  { name: "Uupuneet", city: "Loppi", level: 12, country: "FI" },
  { name: "Kraft", city: "Närpiö", level: 11, country: "FI" },
  { name: "Pojat", city: "Jäppilä", level: 13, country: "FI" },
  { name: "Kierto", city: "Valtimo", level: 12, country: "FI" },
  { name: "Penetra", city: "Perälä", level: 14, country: "FI" },
  { name: "Jehut", city: "Kihniö", level: 13, country: "FI" },
  { name: "Polkka", city: "Säkkijärvi", level: 12, country: "FI" },
  { name: "Raiku", city: "Eura", level: 12, country: "FI" },
  { name: "Gestapojat", city: "Aavasaksa", level: 14, country: "FI" },
  { name: "Vauhti", city: "Äkäslompolo", level: 11, country: "FI" },
  { name: "Kitka", city: "Kihniö", level: 12, country: "FI" },
  { name: "Talvisota", city: "Lapinjärvi", level: 13, country: "FI" },
  { name: "Eräveikot", city: "Kuusamo", level: 12, country: "FI" },

  { name: "Luleå", city: "Luulaja", level: 35, country: "SE" },
  { name: "Färjestad", city: "Karlstad", level: 35, country: "SE" },
  { name: "HV-71", city: "Jönköping", level: 35, country: "SE" },
  { name: "Djurgården", city: "Tukholma", level: 35, country: "SE" },
  { name: "AIK", city: "Tukholma", level: 34, country: "SE" },
  { name: "Brynäs", city: "Gävle", level: 33, country: "SE" },
  { name: "Malmö", city: "Malmö", level: 34, country: "SE" },
  { name: "Frölunda", city: "Götebord", level: 34, country: "SE" },
  { name: "Timrå", city: "Timrå", level: 33, country: "SE" },
  { name: "Leksand", city: "Leksand", level: 33, country: "SE" },

  { name: "Haie", city: "Köln", level: 31, country: "DE" },
  { name: "Huskies", city: "Kassel", level: 32, country: "DE" },
  { name: "Adler", city: "Mannheim", level: 29, country: "DE" },
  { name: "Eisbären", city: "Berliini", level: 31, country: "DE" },
  { name: "Lions", city: "Frankfurt", level: 31, country: "DE" },
  { name: "Moskitos", city: "Essen", level: 30, country: "DE" },
  { name: "Capitals", city: "Berliini", level: 31, country: "DE" },
  { name: "Landshut", city: "Landshut", level: 29, country: "DE" },

  { name: "Sparta", city: "Praha", level: 34, country: "CZ" },
  { name: "Budejovice", city: "Budejovice", level: 34, country: "CZ" },
  { name: "Vitkovice", city: "Ostrava", level: 33, country: "CZ" },
  { name: "HC Petra", city: "Vsetin", level: 33, country: "CZ" },
  { name: "Pardubice", city: "Pardubice", level: 34, country: "CZ" },
  { name: "HC Kladno", city: "Kladno", level: 35, country: "CZ" },
  { name: "Plzen", city: "Plzen", level: 32, country: "CZ" },
  { name: "Slavia", city: "Praha", level: 32, country: "CZ" },

  { name: "SKA", city: "Pietari", level: 32, country: "RU" },
  { name: "Dynamo", city: "Moskova", level: 33, country: "RU" },
  { name: "Torpedo", city: "Jaroslavl", level: 34, country: "RU" },
  { name: "Lada", city: "Togliatti", level: 34, country: "RU" },
  { name: "Metallurg", city: "Magnitogorsk", level: 35, country: "RU" },
  { name: "Bars", city: "Kazan", level: 34, country: "RU" },
  { name: "Lokomotiv", city: "Jaroslavl", level: 33, country: "RU" },
  { name: "Avangard", city: "Omsk", level: 32, country: "RU" },

  { name: "Davos", city: "Davos", level: 34, country: "CH" },
  { name: "Bern", city: "Bern", level: 33, country: "CH" },
  { name: "Zug", city: "Zug", level: 32, country: "CH" },
  { name: "Rapperswil", city: "Rapperswil", level: 32, country: "CH" },
  { name: "Lions", city: "Zürich", level: 33, country: "CH" },
  { name: "Kloten", city: "Kloten", level: 35, country: "CH" },
  { name: "EHC Chur", city: "Chur", level: 32, country: "CH" },
  { name: "Lugano", city: "Lugano", level: 33, country: "CH" },
  { name: "Fribourg", city: "Fribourg", level: 33, country: "CH" },

  { name: "Slovan", city: "Bratislava", level: 32, country: "SK" },
  { name: "Dukla", city: "Trencin", level: 31, country: "SK" },
  { name: "Kosice", city: "Kosice", level: 32, country: "SK" },

  { name: "HC Bolzano", city: "Bolzano", level: 27, country: "IT" },
  { name: "Devils", city: "Milano", level: 28, country: "IT" },
  { name: "Brunico", city: "Brunico", level: 27, country: "IT" },

  { name: "FeldKirch", city: "Feldkirch", level: 28, country: "AT" },
  { name: "Lustenau", city: "Lustenau", level: 27, country: "AT" },
  { name: "Välk-494", city: "Tartto", level: 23, country: "EE" },

  { name: "Trondheim", city: "Trondheim", level: 25, country: "NO" },
  { name: "Vålerengen", city: "Oslo", level: 26, country: "NO" },

  { name: "Rouen", city: "Rouen", level: 30, country: "FR" },
  { name: "Amiens", city: "Somme", level: 28, country: "FR" },
  { name: "Brest", city: "Brest", level: 27, country: "FR" },
  { name: "Angers", city: "Angers", level: 26, country: "FR" },
  { name: "Caen", city: "Caen", level: 27, country: "FR" },

  { name: "Podhale", city: "Nowy Targ", level: 30, country: "PL" },
  { name: "KS Unia", city: "Osviciem", level: 29, country: "PL" },

  { name: "HC Niks", city: "Riika", level: 29, country: "LV" },

  { name: "Tigers", city: "Amsterdam", level: 20, country: "NL" },
  { name: "Aris", city: "Salonika", level: 18, country: "GR" },
  { name: "Flyers", city: "Dublin", level: 20, country: "IE" },
  { name: "Chiefs", city: "Leuven", level: 21, country: "BE" },
  { name: "Pagodromoi", city: "Ateena", level: 19, country: "GR" },
  { name: "Storm", city: "Manchester", level: 26, country: "GR" },
  { name: "Jesters", city: "Newcastle", level: 25, country: "GB" },
  { name: "Herning", city: "Herning", level: 24, country: "DK" }
];

export const teams = indexBy(
  prop("id"),
  mapIndexed(
    (team: TeamData): Team => ({
      ...team,
      id: uuid(),
      strength: {
        g: -1,
        d: -1,
        a: -1,
        pk: -1,
        pp: -1
      },
      morale: 0,
      isHumanControlled: false,
      effects: [],
      opponentEffects: [],
      strategy: "puurto",
      readiness: 0,
      intensity: 0
    })
  )(teamList)
);

export default teams;

export interface StatsData {
  ranking: [number, number, number];
}

export interface StatsDatas {
  [key: string]: StatsData;
}

export const rawTeamStats: StatsDatas = {
  tps: {
    ranking: [1, 5, 2]
  },
  hifk: {
    ranking: [2, 1, 9]
  },
  hpk: {
    ranking: [3, 10, 3]
  },
  saipa: {
    ranking: [4, 7, 11]
  },
  jokerit: {
    ranking: [5, 3, 1]
  },
  ilves: {
    ranking: [6, 2, 4]
  },
  blues: {
    ranking: [7, 4, 7]
  },
  jyp: {
    ranking: [8, 11, 5]
  },
  tappara: {
    ranking: [9, 6, 8]
  },
  ässät: {
    ranking: [10, 8, 6]
  },
  lukko: {
    ranking: [11, 9, 10]
  },
  pelicans: {
    ranking: [13, 14, 18]
  },
  kalpa: {
    ranking: [12, 12, 12]
  },
  kärpät: {
    ranking: [14, 13, 13]
  },
  hermes: {
    ranking: [15, 15, 14]
  },
  tuto: {
    ranking: [16, 18, 15]
  },
  fps: {
    ranking: [17, 20, 21]
  },
  diskos: {
    ranking: [18, 22, 22]
  },
  sport: {
    ranking: [19, 19, 16]
  },
  sapko: {
    ranking: [20, 23, 19]
  },
  jokipojat: {
    ranking: [21, 17, 20]
  },
  kjt: {
    ranking: [22, 16, 17]
  },
  ahmat: {
    ranking: [23, 24, 23]
  },
  jääkotkat: {
    ranking: [24, 21, 24]
  },
  jukurit: {
    ranking: [28, 32, 36]
  },
  "vg-62": {
    ranking: [35, 33, 41]
  },
  testicles: {
    ranking: [40, 39, 29]
  },
  santaclaus: {
    ranking: [39, 41, 37]
  },
  ruiske: {
    ranking: [37, 38, 27]
  },
  lightning: {
    ranking: [34, 30, 42]
  },
  nikkarit: {
    ranking: [31, 31, 34]
  },
  salama: {
    ranking: [44, 44, 38]
  },
  hait: {
    ranking: [33, 42, 32]
  },
  mahti: {
    ranking: [42, 36, 39]
  },
  siat: {
    ranking: [29, 34, 25]
  },
  veto: {
    ranking: [45, 43, 43]
  },
  ikirouta: {
    ranking: [43, 48, 45]
  },
  jymy: {
    ranking: [46, 45, 47]
  },
  hokki: {
    ranking: [30, 26, 30]
  },
  voitto: {
    ranking: [32, 28, 43]
  },
  teurastus: {
    ranking: [41, 40, 48]
  },
  "komu ht": {
    ranking: [47, 47, 44]
  },
  saappaat: {
    ranking: [38, 37, 35]
  },
  aromi: {
    ranking: [36, 35, 31]
  },
  gepardit: {
    ranking: [27, 27, 28]
  },
  kookoo: {
    ranking: [25, 25, 26]
  },
  hardcore: {
    ranking: [26, 29, 33]
  },
  turmio: {
    ranking: [48, 46, 46]
  }
};
