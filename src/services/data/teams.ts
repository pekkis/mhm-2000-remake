import { mapIndexed } from "ramda-adjunct";
import { Team } from "../../types/team";
import uuid from "uuid";
import { indexBy, prop } from "ramda";
import { AllCountries } from "../../types/country";

interface TeamData {
  name: string;
  city: string;
  level: number;
  country: AllCountries;
}

const teamList: TeamData[] = [
  { name: "TPS", city: "Turku", level: 33, country: "FI" },
  { name: "HIFK", city: "Helsinki", level: 30, country: "FI" },
  { name: "HPK", city: "Hämeenlinna", level: 32, country: "FI" },
  { name: "SaiPa", city: "Lappeenranta", level: 29, country: "FI" },
  { name: "Jokerit", city: "Helsinki", level: 31, country: "FI" },
  { name: "Ilves", city: "Tampere", level: 30, country: "FI" },
  { name: "Blues", city: "Espoo", level: 31, country: "FI" },
  { name: "JYP", city: "Jyväskylä", level: 29, country: "FI" },
  { name: "Tappara", city: "Tampere", level: 32, country: "FI" },
  { name: "Ässät", city: "Pori", level: 29, country: "FI" },
  { name: "Lukko", city: "Rauma", level: 31, country: "FI" },
  { name: "Pelicans", city: "Lahti", level: 28, country: "FI" },

  { name: "Kärpät", city: "Oulu", level: 29, country: "FI" },
  { name: "Hermes", city: "Kokkola", level: 24, country: "FI" },
  { name: "TuTo", city: "Turku", level: 26, country: "FI" },
  { name: "FPS", city: "Forssa", level: 22, country: "FI" },
  { name: "Diskos", city: "Jyväskylä", level: 23, country: "FI" },
  { name: "Sport", city: "Vaasa", level: 26, country: "FI" },
  { name: "SaPKo", city: "Savonlinna", level: 21, country: "FI" },
  { name: "Jokipojat", city: "Joensuu", level: 23, country: "FI" },
  { name: "KJT", city: "Järvenpää", level: 21, country: "FI" },
  { name: "Ahmat", city: "Hyvinkää", level: 22, country: "FI" },
  { name: "Jääkotkat", city: "Uusikaupunki", level: 23, country: "FI" },
  { name: "Jukurit", city: "Mikkeli", level: 17, country: "FI" },

  { name: "VG-62", city: "Naantali", level: 16, country: "FI" },
  { name: "Testicles", city: "Kivesjärvi", level: 17, country: "FI" },
  { name: "SantaClaus", city: "Rovaniemi", level: 15, country: "FI" },
  { name: "Ruiske", city: "Tiukukoski", level: 18, country: "FI" },
  { name: "Lightning", city: "Kerava", level: 17, country: "FI" },
  { name: "Nikkarit", city: "Riihimäki", level: 17, country: "FI" },
  { name: "Salama", city: "Sompio", level: 15, country: "FI" },
  { name: "Hait", city: "Nuuksio", level: 15, country: "FI" },
  { name: "Mahti", city: "Mäntsälä", level: 14, country: "FI" },
  { name: "Siat", city: "Syväri", level: 13, country: "FI" },
  { name: "Veto", city: "Töysä", level: 17, country: "FI" },
  { name: "Ikirouta", city: "Inari", level: 14, country: "FI" },
  { name: "Jymy", city: "Sotkamo", level: 12, country: "FI" },
  { name: "Hokki", city: "Kajaani", level: 17, country: "FI" },
  { name: "Voitto", city: "Kangasala", level: 17, country: "FI" },
  { name: "Teurastus", city: "Porvoo", level: 17, country: "FI" },
  { name: "KoMu HT", city: "Korsholm", level: 13, country: "FI" },
  { name: "Saappaat", city: "Nokia", level: 17, country: "FI" },
  { name: "Aromi", city: "Valkeakoski", level: 17, country: "FI" },
  { name: "Gepardit", city: "Klaukkala", level: 21, country: "FI" },
  { name: "KooKoo", city: "Kouvola", level: 23, country: "FI" },
  { name: "HardCore", city: "Loimaa", level: 21, country: "FI" },
  { name: "Turmio", city: "Kolari", level: 12, country: "FI" },
  { name: "KalPa", city: "Kuopio", level: 20, country: "FI" },

  { name: "Luleå", city: "Luulaja", level: 34, country: "SE" },
  { name: "Färjestad", city: "Karlstad", level: 34, country: "SE" },
  { name: "HV-71", city: "Jönköping", level: 34, country: "SE" },
  { name: "Djurgården", city: "Tukholma", level: 34, country: "SE" },
  { name: "AIK", city: "Tukholma", level: 33, country: "SE" },
  { name: "Brynäs", city: "Gävle", level: 32, country: "SE" },
  { name: "Malmö", city: "Malmö", level: 33, country: "SE" },
  { name: "Frölunda", city: "Götebord", level: 33, country: "SE" },
  { name: "Timrå", city: "Timrå", level: 32, country: "SE" },
  { name: "Leksand", city: "Leksand", level: 32, country: "SE" },

  { name: "Haie", city: "Köln", level: 30, country: "DE" },
  { name: "Huskies", city: "Kassel", level: 31, country: "DE" },
  { name: "Adler", city: "Mannheim", level: 28, country: "DE" },
  { name: "Eisbären", city: "Berliini", level: 30, country: "DE" },
  { name: "Lions", city: "Frankfurt", level: 30, country: "DE" },
  { name: "Moskitos", city: "Essen", level: 29, country: "DE" },
  { name: "Capitals", city: "Berliini", level: 30, country: "DE" },
  { name: "Landshut", city: "Landshut", level: 28, country: "DE" },

  { name: "Sparta", city: "Praha", level: 33, country: "CZ" },
  { name: "Budejovice", city: "Budejovice", level: 33, country: "CZ" },
  { name: "Vitkovice", city: "Ostrava", level: 32, country: "CZ" },
  { name: "HC Petra", city: "Vsetin", level: 32, country: "CZ" },
  { name: "Pardubice", city: "Pardubice", level: 33, country: "CZ" },
  { name: "HC Kladno", city: "Kladno", level: 34, country: "CZ" },
  { name: "Plzen", city: "Plzen", level: 31, country: "CZ" },
  { name: "Slavia", city: "Praha", level: 31, country: "CZ" },

  { name: "SKA", city: "Pietari", level: 31, country: "RU" },
  { name: "Dynamo", city: "Moskova", level: 32, country: "RU" },
  { name: "Torpedo", city: "Jaroslavl", level: 33, country: "RU" },
  { name: "Lada", city: "Togliatti", level: 33, country: "RU" },
  { name: "Metallurg", city: "Magnitogorsk", level: 34, country: "RU" },
  { name: "Bars", city: "Kazan", level: 33, country: "RU" },
  { name: "Lokomotiv", city: "Jaroslavl", level: 32, country: "RU" },
  { name: "Avangard", city: "Omsk", level: 31, country: "RU" },

  { name: "Davos", city: "Davos", level: 33, country: "CH" },
  { name: "Bern", city: "Bern", level: 32, country: "CH" },
  { name: "Zug", city: "Zug", level: 31, country: "CH" },
  { name: "Rapperswil", city: "Rapperswil", level: 31, country: "CH" },
  { name: "Lions", city: "Zürich", level: 32, country: "CH" },
  { name: "Kloten", city: "Kloten", level: 34, country: "CH" },
  { name: "EHC Chur", city: "Chur", level: 31, country: "CH" },
  { name: "Lugano", city: "Lugano", level: 32, country: "CH" },
  { name: "Fribourg", city: "Fribourg", level: 32, country: "CH" },

  { name: "Slovan", city: "Bratislava", level: 31, country: "SK" },
  { name: "Dukla", city: "Trencin", level: 30, country: "SK" },
  { name: "Kosice", city: "Kosice", level: 31, country: "SK" },

  { name: "HC Bolzano", city: "Bolzano", level: 26, country: "IT" },
  { name: "Devils", city: "Milano", level: 27, country: "IT" },
  { name: "Brunico", city: "Brunico", level: 26, country: "IT" },

  { name: "FeldKirch", city: "Feldkirch", level: 27, country: "AT" },
  { name: "Lustenau", city: "Lustenau", level: 26, country: "AT" },
  { name: "Välk-494", city: "Tartto", level: 22, country: "EE" },

  { name: "Trondheim", city: "Trondheim", level: 24, country: "NO" },
  { name: "Vålerengen", city: "Oslo", level: 25, country: "NO" },

  { name: "Rouen", city: "Rouen", level: 29, country: "FR" },
  { name: "Amiens", city: "Somme", level: 27, country: "FR" },
  { name: "Brest", city: "Brest", level: 26, country: "FR" },
  { name: "Angers", city: "Angers", level: 25, country: "FR" },
  { name: "Caen", city: "Caen", level: 26, country: "FR" },

  { name: "Podhale", city: "Nowy Targ", level: 29, country: "PL" },
  { name: "KS Unia", city: "Osviciem", level: 28, country: "PL" },

  { name: "HC Niks", city: "Riika", level: 28, country: "LV" },

  { name: "Tigers", city: "Amsterdam", level: 19, country: "NL" },
  { name: "Aris", city: "Salonika", level: 17, country: "GR" },
  { name: "Flyers", city: "Dublin", level: 19, country: "IE" },
  { name: "Chiefs", city: "Leuven", level: 20, country: "BE" },
  { name: "Pagodromoi", city: "Ateena", level: 18, country: "GR" },
  { name: "Storm", city: "Manchester", level: 25, country: "GR" },
  { name: "Jesters", city: "Newcastle", level: 24, country: "GB" },
  { name: "Herning", city: "Herning", level: 23, country: "GB" }
];

export const teams = indexBy(
  prop("id"),
  mapIndexed(
    (team: TeamData): Team => ({
      ...team,
      id: uuid(),
      strength: {
        g: 0,
        d: 0,
        a: 0
      },
      morale: 0,
      isHumanControlled: false
    })
  )(teamList)
);

export default teams;
