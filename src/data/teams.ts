import { mapIndexed } from "ramda-adjunct";
import { string } from "random-js";

interface TeamData {
  name: string;
  city: string;
  level: number;
  domestic: boolean;
}

const teamList: TeamData[] = [
  { name: "TPS", city: "Turku", level: 33, domestic: true },
  { name: "HIFK", city: "Helsinki", level: 30, domestic: true },
  { name: "HPK", city: "Hämeenlinna", level: 32, domestic: true },
  { name: "SaiPa", city: "Lappeenranta", level: 29, domestic: true },
  { name: "Jokerit", city: "Helsinki", level: 31, domestic: true },
  { name: "Ilves", city: "Tampere", level: 30, domestic: true },
  { name: "Blues", city: "Espoo", level: 31, domestic: true },
  { name: "JYP", city: "Jyväskylä", level: 29, domestic: true },
  { name: "Tappara", city: "Tampere", level: 32, domestic: true },
  { name: "Ässät", city: "Pori", level: 29, domestic: true },
  { name: "Lukko", city: "Rauma", level: 31, domestic: true },
  { name: "Pelicans", city: "Lahti", level: 28, domestic: true },
  { name: "KalPa", city: "Kuopio", level: 20, domestic: true },

  { name: "Kärpät", city: "Oulu", level: 29, domestic: true },
  { name: "Hermes", city: "Kokkola", level: 24, domestic: true },
  { name: "TuTo", city: "Turku", level: 26, domestic: true },

  { name: "FPS", city: "Forssa", level: 22, domestic: true },
  { name: "Diskos", city: "Jyväskylä", level: 23, domestic: true },
  { name: "Sport", city: "Vaasa", level: 26, domestic: true },
  { name: "SaPKo", city: "Savonlinna", level: 21, domestic: true },

  { name: "Jokipojat", city: "Joensuu", level: 23, domestic: true },
  { name: "KJT", city: "Järvenpää", level: 21, domestic: true },
  { name: "Ahmat", city: "Hyvinkää", level: 22, domestic: true },
  { name: "Jääkotkat", city: "Uusikaupunki", level: 23, domestic: true },

  { name: "Jukurit", city: "Mikkeli", level: 17, domestic: true },
  { name: "VG-62", city: "Naantali", level: 16, domestic: true },
  { name: "Testicles", city: "Kivesjärvi", level: 17, domestic: true },
  { name: "SantaClaus", city: "Rovaniemi", level: 15, domestic: true },
  { name: "Ruiske", city: "Tiukukoski", level: 18, domestic: true },
  { name: "Lightning", city: "Kerava", level: 17, domestic: true },
  { name: "Nikkarit", city: "Riihimäki", level: 17, domestic: true },
  { name: "Salama", city: "Sompio", level: 15, domestic: true },
  { name: "Hait", city: "Nuuksio", level: 15, domestic: true },
  { name: "Mahti", city: "Mäntsälä", level: 14, domestic: true },
  { name: "Siat", city: "Syväri", level: 13, domestic: true },
  { name: "Veto", city: "Töysä", level: 17, domestic: true },
  { name: "Ikirouta", city: "Inari", level: 14, domestic: true },
  { name: "Jymy", city: "Sotkamo", level: 12, domestic: true },
  { name: "Hokki", city: "Salo", level: 17, domestic: true },
  { name: "Voitto", city: "Kangasala", level: 17, domestic: true },
  { name: "Teurastus", city: "Porvoo", level: 17, domestic: true },
  { name: "KoMu HT", city: "Korsholm", level: 13, domestic: true },
  { name: "Saappaat", city: "Nokia", level: 17, domestic: true },
  { name: "Aromi", city: "Valkeakoski", level: 17, domestic: true },
  { name: "Gepardit", city: "Klaukkala", level: 21, domestic: true },
  { name: "KooKoo", city: "Kouvola", level: 23, domestic: true },
  { name: "HardCore", city: "Loimaa", level: 21, domestic: true },
  { name: "Turmio", city: "Kolari", level: 12, domestic: true },

  { name: "Luleå", city: "Luulaja", level: 34, domestic: false },
  { name: "Färjestad", city: "Karlstad", level: 34, domestic: false },
  { name: "HV-71", city: "Jönköping", level: 34, domestic: false },
  { name: "Djurgården", city: "Tukholma", level: 34, domestic: false },
  { name: "AIK", city: "Tukholma", level: 33, domestic: false },
  { name: "Brynäs", city: "Gävle", level: 32, domestic: false },
  { name: "Malmö", city: "Malmö", level: 33, domestic: false },
  { name: "Frölunda", city: "Götebord", level: 33, domestic: false },
  { name: "Timrå", city: "Timrå", level: 32, domestic: false },
  { name: "Leksand", city: "Leksand", level: 32, domestic: false },

  { name: "Haie", city: "Köln", level: 30, domestic: false },
  { name: "Huskies", city: "Kassel", level: 31, domestic: false },
  { name: "Adler", city: "Mannheim", level: 28, domestic: false },
  { name: "Eisbären", city: "Berliini", level: 30, domestic: false },
  { name: "Lions", city: "Frankfurt", level: 30, domestic: false },
  { name: "Moskitos", city: "Essen", level: 29, domestic: false },
  { name: "Capitals", city: "Berliini", level: 30, domestic: false },
  { name: "Landshut", city: "Landshut", level: 28, domestic: false },
  { name: "Sparta", city: "Praha", level: 33, domestic: false },
  { name: "Budejovice", city: "Budejovice", level: 33, domestic: false },
  { name: "Vitkovice", city: "Ostrava", level: 32, domestic: false },
  { name: "HC Petra", city: "Vsetin", level: 32, domestic: false },
  { name: "Pardubice", city: "Pardubice", level: 33, domestic: false },
  { name: "HC Kladno", city: "Kladno", level: 34, domestic: false },
  { name: "Plzen", city: "Plzen", level: 31, domestic: false },
  { name: "Slavia", city: "Praha", level: 31, domestic: false },
  { name: "SKA", city: "Pietari", level: 31, domestic: false },
  { name: "Dynamo", city: "Moskova", level: 32, domestic: false },
  { name: "Torpedo", city: "Jaroslavl", level: 33, domestic: false },
  { name: "Lada", city: "Togliatti", level: 33, domestic: false },
  { name: "Metallurg", city: "Magnitogorsk", level: 34, domestic: false },
  { name: "Bars", city: "Kazan", level: 33, domestic: false },
  { name: "Lokomotiv", city: "Jaroslavl", level: 32, domestic: false },
  { name: "Avangard", city: "Omsk", level: 31, domestic: false },
  { name: "Davos", city: "Davos", level: 33, domestic: false },
  { name: "Bern", city: "Bern", level: 32, domestic: false },
  { name: "Zug", city: "Zug", level: 31, domestic: false },
  { name: "Rapperswil", city: "Rapperswil", level: 31, domestic: false },
  { name: "Lions", city: "Zürich", level: 32, domestic: false },
  { name: "Kloten", city: "Kloten", level: 34, domestic: false },
  { name: "EHC Chur", city: "Chur", level: 31, domestic: false },
  { name: "Lugano", city: "Lugano", level: 32, domestic: false },
  { name: "Fribourg", city: "Fribourg", level: 32, domestic: false },
  { name: "Slovan", city: "Bratislava", level: 31, domestic: false },
  { name: "Dukla", city: "Trencin", level: 30, domestic: false },
  { name: "Kosice", city: "Kosice", level: 31, domestic: false },

  { name: "HC Bolzano", city: "Bolzano", level: 26, domestic: false },
  { name: "Devils", city: "Milano", level: 27, domestic: false },
  { name: "Brunico", city: "Brunico", level: 26, domestic: false },

  { name: "Storm", city: "Manchester", level: 25, domestic: false },
  { name: "Jesters", city: "Newcastle", level: 24, domestic: false },
  { name: "FeldKirch", city: "Feldkirch", level: 27, domestic: false },
  { name: "Lustenau", city: "Lustenau", level: 26, domestic: false },
  { name: "Välk-494", city: "Tartto", level: 22, domestic: false },
  { name: "Herning", city: "Herning", level: 23, domestic: false },
  { name: "Trondheim", city: "Trondheim", level: 24, domestic: false },
  { name: "Vålerengen", city: "Oslo", level: 25, domestic: false },
  { name: "Rouen", city: "Rouen", level: 29, domestic: false },
  { name: "Amiens", city: "Somme", level: 27, domestic: false },
  { name: "Brest", city: "Brest", level: 26, domestic: false },
  { name: "Angers", city: "Angers", level: 25, domestic: false },

  { name: "Caen", city: "Caen", level: 26, domestic: false },
  { name: "Pagodromoi", city: "Ateena", level: 18, domestic: false },
  { name: "Aris", city: "Salonika", level: 17, domestic: false },
  { name: "Flyers", city: "Dublin", level: 19, domestic: false },
  { name: "Chiefs", city: "Leuven", level: 20, domestic: false },

  { name: "Podhale", city: "Nowy Targ", level: 29, domestic: false },
  { name: "KS Unia", city: "Osviciem", level: 28, domestic: false },
  { name: "Tigers", city: "Amsterdam", level: 19, domestic: false },
  { name: "HC Niks", city: "Riika", level: 28, domestic: false }
];

const teams = mapIndexed((team: TeamData, id: number) => ({
  ...team,
  strength: team.level * 10,
  id,
  morale: 0
}))(teamList);

export default teams;
