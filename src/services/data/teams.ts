import { mapIndexed } from "ramda-adjunct";
import { Team } from "../../types/team";
import uuid from "uuid";
import { indexBy, prop, pipe, toPairs, map, fromPairs } from "ramda";
import { AllCountries } from "../../types/country";
import { nameToId } from "../team";
import { Arena } from "../../types/arena";

export interface RawTeamData {
  name: string;
  city: string;
  level: number;
  country: AllCountries;
  arena: Arena;
}

const teamList: RawTeamData[] = [
  {
    name: "TPS",
    city: "Turku",
    level: 34,
    country: "FI",
    arena: {
      level: 5,
      standing: 28,
      seats: 90,
      boxes: true,
      name: "Turkuhallin Nimihirviö Areena"
    }
  },
  {
    name: "HIFK",
    city: "Helsinki",
    level: 31,
    country: "FI",
    arena: {
      level: 4,
      standing: 0,
      seats: 80,
      boxes: true,
      name: "Nordenskjöld Areena"
    }
  },
  {
    name: "HPK",
    city: "Hämeenlinna",
    level: 33,
    country: "FI",
    arena: {
      level: 3,
      standing: 30,
      seats: 20,
      boxes: false,
      name: "Rinkelinmäen Halli"
    }
  },
  {
    name: "SaiPa",
    city: "Lappeenranta",
    level: 30,
    country: "FI",
    arena: {
      level: 3,
      standing: 27,
      seats: 25,
      boxes: false,
      name: "Kisapuisto"
    }
  },
  {
    name: "Jokerit",
    city: "Helsinki",
    level: 32,
    country: "FI",
    arena: {
      level: 6,
      standing: 0,
      seats: 127,
      boxes: true,
      name: "Hjartwall Areena"
    }
  },
  {
    name: "Ilves",
    city: "Tampere",
    level: 31,
    country: "FI",
    arena: {
      level: 4,
      standing: 12,
      seats: 68,
      boxes: false,
      name: "Hakametsän Areena"
    }
  },
  {
    name: "Blues",
    city: "Espoo",
    level: 33,
    country: "FI",
    arena: {
      level: 5,
      standing: 0,
      seats: 74,
      boxes: true,
      name: "ItäAuto Areena"
    }
  },
  {
    name: "JYP",
    city: "Jyväskylä",
    level: 30,
    country: "FI",
    arena: {
      level: 3,
      standing: 26,
      seats: 22,
      boxes: false,
      name: "Hippos"
    }
  },
  {
    name: "Tappara",
    city: "Tampere",
    level: 33,
    country: "FI",
    arena: {
      level: 4,
      standing: 12,
      seats: 68,
      boxes: false,
      name: "Hakametsän Areena"
    }
  },
  {
    name: "Ässät",
    city: "Pori",
    level: 30,
    country: "FI",
    arena: {
      level: 3,
      standing: 25,
      seats: 40,
      boxes: false,
      name: "Isonmäen Hornankattila"
    }
  },
  {
    name: "Lukko",
    city: "Rauma",
    level: 32,
    country: "FI",
    arena: {
      level: 4,
      standing: 29,
      seats: 31,
      boxes: false,
      name: "Äijänsuon Areena"
    }
  },
  {
    name: "Pelicans",
    city: "Lahti",
    level: 29,
    country: "FI",
    arena: {
      level: 3,
      standing: 21,
      seats: 30,
      boxes: false,
      name: "Lahden Jäähalli"
    }
  },

  {
    name: "Kärpät",
    city: "Oulu",
    level: 30,
    country: "FI",
    arena: {
      level: 3,
      standing: 20,
      seats: 56,
      boxes: false,
      name: "Raksilan Jäähalli"
    }
  },
  {
    name: "Hermes",
    city: "Kokkola",
    level: 25,
    country: "FI",
    arena: {
      level: 2,
      standing: 30,
      seats: 10,
      boxes: false,
      name: "Kokkolahalli"
    }
  },
  {
    name: "TuTo",
    city: "Turku",
    level: 27,
    country: "FI",
    arena: {
      level: 3,
      standing: 33,
      seats: 29,
      boxes: false,
      name: "Kupittaan Kiekkokeskus"
    }
  },
  {
    name: "FPS",
    city: "Forssa",
    level: 23,
    country: "FI",
    arena: {
      level: 2,
      standing: 20,
      seats: 10,
      boxes: false,
      name: "Forssan Jäähalli"
    }
  },
  {
    name: "Diskos",
    city: "Jyväskylä",
    level: 24,
    country: "FI",
    arena: {
      level: 3,
      standing: 26,
      seats: 22,
      boxes: false,
      name: "Jyväskylä-Halli"
    }
  },
  {
    name: "Sport",
    city: "Vaasa",
    level: 27,
    country: "FI",
    arena: {
      level: 2,
      standing: 40,
      seats: 6,
      boxes: false,
      name: "Vaasan Uusi Areena"
    }
  },
  {
    name: "SaPKo",
    city: "Savonlinna",
    level: 22,
    country: "FI",
    arena: {
      level: 2,
      standing: 20,
      seats: 8,
      boxes: false,
      name: "Savonlinnan Lato"
    }
  },
  {
    name: "Jokipojat",
    city: "Joensuu",
    level: 24,
    country: "FI",
    arena: {
      level: 2,
      standing: 30,
      seats: 20,
      boxes: false,
      name: "Mehtimäki"
    }
  },
  {
    name: "KJT",
    city: "Järvenpää",
    level: 22,
    country: "FI",
    arena: {
      level: 1,
      standing: 10,
      seats: 10,
      boxes: false,
      name: "Järvenpään Hökötys"
    }
  },
  {
    name: "Ahmat",
    city: "Hyvinkää",
    level: 23,
    country: "FI",
    arena: {
      level: 2,
      standing: 15,
      seats: 7,
      boxes: false,
      name: "Hyvinkään 'Areena'"
    }
  },
  {
    name: "Jääkotkat",
    city: "Uusikaupunki",
    level: 24,
    country: "FI",
    arena: {
      level: 2,
      standing: 12,
      seats: 10,
      boxes: false,
      name: "Uudenkaupungin Halli"
    }
  },
  {
    name: "Jukurit",
    city: "Mikkeli",
    level: 18,
    country: "FI",
    arena: {
      level: 1,
      standing: 14,
      seats: 5,
      boxes: false,
      name: "Mikkeli-keskus"
    }
  },

  {
    name: "VG-62",
    city: "Naantali",
    level: 17,
    country: "FI",
    arena: {
      level: 1,
      standing: 10,
      seats: 2,
      boxes: false,
      name: "Muumimaailma"
    }
  },
  {
    name: "Testicles",
    city: "Kivesjärvi",
    level: 18,
    country: "FI",
    arena: {
      level: 1,
      standing: 10,
      seats: 3,
      boxes: false,
      name: "Balls Areena"
    }
  },
  {
    name: "SantaClaus",
    city: "Rovaniemi",
    level: 16,
    country: "FI",
    arena: {
      level: 2,
      standing: 10,
      seats: 3,
      boxes: false,
      name: "Napapiiri"
    }
  },
  {
    name: "Ruiske",
    city: "Tiukukoski",
    level: 19,
    country: "FI",
    arena: {
      level: 1,
      standing: 11,
      seats: 3,
      boxes: false,
      name: "Diazepam Areena"
    }
  },
  {
    name: "Lightning",
    city: "Kerava",
    level: 18,
    country: "FI",
    arena: {
      level: 1,
      standing: 16,
      seats: 2,
      boxes: false,
      name: "Keravan Kuoppa"
    }
  },
  {
    name: "Nikkarit",
    city: "Riihimäki",
    level: 18,
    country: "FI",
    arena: {
      level: 1,
      standing: 10,
      seats: 3,
      boxes: false,
      name: "Riihimäen Jäähalli"
    }
  },
  {
    name: "Salama",
    city: "Sompio",
    level: 16,
    country: "FI",
    arena: {
      level: 1,
      standing: 8,
      seats: 2,
      boxes: false,
      name: "Sompion Hoki-Sentter"
    }
  },
  {
    name: "Hait",
    city: "Nuuksio",
    level: 16,
    country: "FI",
    arena: {
      level: 1,
      standing: 8,
      seats: 2,
      boxes: false,
      name: "Nuuksion Jäähalli"
    }
  },
  {
    name: "Mahti",
    city: "Mäntsälä",
    level: 15,
    country: "FI",
    arena: {
      level: 1,
      standing: 7,
      seats: 2,
      boxes: false,
      name: "Mäntsälän Tekojäärata"
    }
  },
  {
    name: "Siat",
    city: "Syväri",
    level: 14,
    country: "FI",
    arena: {
      level: 1,
      standing: 14,
      seats: 4,
      boxes: false,
      name: "Itä-Karjala Areena"
    }
  },
  {
    name: "Veto",
    city: "Töysä",
    level: 18,
    country: "FI",
    arena: {
      level: 1,
      standing: 10,
      seats: 2,
      boxes: false,
      name: "Yläasteen Kaukalo"
    }
  },
  {
    name: "Ikirouta",
    city: "Inari",
    level: 15,
    country: "FI",
    arena: {
      level: 1,
      standing: 7,
      seats: 2,
      boxes: false,
      name: "Inarijärven Jää"
    }
  },
  {
    name: "Jymy",
    city: "Sotkamo",
    level: 13,
    country: "FI",
    arena: {
      level: 1,
      standing: 7,
      seats: 2,
      boxes: false,
      name: "Sotkamon Pesismekka"
    }
  },
  {
    name: "Hokki",
    city: "Kajaani",
    level: 18,
    country: "FI",
    arena: {
      level: 1,
      standing: 10,
      seats: 4,
      boxes: false,
      name: "Kajaanin Kiekkopyhättö"
    }
  },
  {
    name: "Voitto",
    city: "Kangasala",
    level: 18,
    country: "FI",
    arena: {
      level: 1,
      standing: 7,
      seats: 3,
      boxes: false,
      name: "Kangasalareena"
    }
  },
  {
    name: "Teurastus",
    city: "Porvoo",
    level: 18,
    country: "FI",
    arena: {
      level: 1,
      standing: 10,
      seats: 2,
      boxes: false,
      name: "Gore Areena"
    }
  },
  {
    name: "KoMu HT",
    city: "Korsholm",
    level: 14,
    country: "FI",
    arena: {
      level: 1,
      standing: 6,
      seats: 2,
      boxes: false,
      name: "Korsholm Hockeyring"
    }
  },
  {
    name: "Saappaat",
    city: "Nokia",
    level: 18,
    country: "FI",
    arena: {
      level: 1,
      standing: 6,
      seats: 3,
      boxes: false,
      name: "Nokian Kylpylä"
    }
  },
  {
    name: "Aromi",
    city: "Valkeakoski",
    level: 18,
    country: "FI",
    arena: {
      level: 1,
      standing: 6,
      seats: 3,
      boxes: false,
      name: "Paperitehtaan Kellari"
    }
  },
  {
    name: "Gepardit",
    city: "Klaukkala",
    level: 22,
    country: "FI",
    arena: {
      level: 1,
      standing: 12,
      seats: 4,
      boxes: false,
      name: "Klaukkalan Areena"
    }
  },
  {
    name: "KooKoo",
    city: "Kouvola",
    level: 24,
    country: "FI",
    arena: {
      level: 3,
      standing: 22,
      seats: 38,
      boxes: false,
      name: "Kouvolan Jäähalli"
    }
  },
  {
    name: "HardCore",
    city: "Loimaa",
    level: 22,
    country: "FI",
    arena: {
      level: 2,
      standing: 15,
      seats: 5,
      boxes: false,
      name: "Granit Areena"
    }
  },
  {
    name: "Turmio",
    city: "Kolari",
    level: 35,
    country: "FI",
    arena: {
      level: 1,
      standing: 8,
      seats: 2,
      boxes: false,
      name: "Lunastus Areena"
    }
  },
  {
    name: "KalPa",
    city: "Kuopio",
    level: 21,
    country: "FI",
    arena: {
      level: 2,
      standing: 28,
      seats: 22,
      boxes: false,
      name: "Niiralan Monttu"
    }
  },

  {
    name: "Enkelit",
    city: "Helvetti",
    level: 12,
    country: "FI",
    arena: {
      level: 1,
      standing: 5,
      seats: 0,
      boxes: false,
      name: "Jäätynyt Helvetti"
    }
  },
  {
    name: "Maila",
    city: "Nurmijärvi",
    level: 12,
    country: "FI",
    arena: {
      level: 1,
      standing: 4,
      seats: 1,
      boxes: false,
      name: "Nurmijärven Jäähalli"
    }
  },
  {
    name: "Sopupallo",
    city: "Juva",
    level: 11,
    country: "FI",
    arena: {
      level: 1,
      standing: 4,
      seats: 0,
      boxes: false,
      name: "Korruptiokeskus"
    }
  },
  {
    name: "Uupuneet",
    city: "Loppi",
    level: 12,
    country: "FI",
    arena: {
      level: 1,
      standing: 3,
      seats: 2,
      boxes: false,
      name: "Väsymyskeskus"
    }
  },
  {
    name: "Kraft",
    city: "Närpiö",
    level: 11,
    country: "FI",
    arena: {
      level: 1,
      standing: 7,
      seats: 0,
      boxes: false,
      name: "Närpeshallen"
    }
  },
  {
    name: "Pojat",
    city: "Jäppilä",
    level: 13,
    country: "FI",
    arena: {
      level: 1,
      standing: 5,
      seats: 0,
      boxes: false,
      name: "Jäppilänjänkä"
    }
  },
  {
    name: "Kierto",
    city: "Valtimo",
    level: 12,
    country: "FI",
    arena: {
      level: 1,
      standing: 5,
      seats: 0,
      boxes: false,
      name: "Verenluovutusklinikka"
    }
  },
  {
    name: "Penetra",
    city: "Perälä",
    level: 14,
    country: "FI",
    arena: {
      level: 1,
      standing: 2,
      seats: 0,
      boxes: false,
      name: "Perärööri"
    }
  },
  {
    name: "Jehut",
    city: "Kihniö",
    level: 13,
    country: "FI",
    arena: {
      level: 1,
      standing: 6,
      seats: 0,
      boxes: false,
      name: "Jehuhalli"
    }
  },
  {
    name: "Polkka",
    city: "Säkkijärvi",
    level: 12,
    country: "FI",
    arena: {
      level: 1,
      standing: 5,
      seats: 0,
      boxes: false,
      name: "Tanssilava"
    }
  },
  {
    name: "Raiku",
    city: "Eura",
    level: 12,
    country: "FI",
    arena: {
      level: 1,
      standing: 5,
      seats: 0,
      boxes: false,
      name: "Kaikukoppa"
    }
  },
  {
    name: "Gestapojat",
    city: "Aavasaksa",
    level: 14,
    country: "FI",
    arena: {
      level: 1,
      standing: 6,
      seats: 4,
      boxes: false,
      name: "Horst Wessel-halli"
    }
  },
  {
    name: "Vauhti",
    city: "Äkäslompolo",
    level: 11,
    country: "FI",
    arena: {
      level: 1,
      standing: 6,
      seats: 0,
      boxes: false,
      name: "Tunturin Huippu"
    }
  },
  {
    name: "Kitka",
    city: "Kihniö",
    level: 12,
    country: "FI",
    arena: {
      level: 1,
      standing: 8,
      seats: 0,
      boxes: false,
      name: "Kitkakeskus"
    }
  },
  {
    name: "Talvisota",
    city: "Lapinjärvi",
    level: 13,
    country: "FI",
    arena: {
      level: 1,
      standing: 6,
      seats: 2,
      boxes: false,
      name: "Sivarikeskus"
    }
  },
  {
    name: "Eräveikot",
    city: "Kuusamo",
    level: 12,
    country: "FI",
    arena: {
      level: 1,
      standing: 7,
      seats: 0,
      boxes: false,
      name: "Kuusamon Kutsu"
    }
  },

  {
    name: "Luleå",
    city: "Luulaja",
    level: 35,
    country: "SE",
    arena: {
      level: 3,
      standing: 20,
      seats: 45,
      boxes: false
    }
  },
  {
    name: "Färjestad",
    city: "Karlstad",
    level: 35,
    country: "SE",
    arena: {
      level: 3,
      standing: 10,
      seats: 50,
      boxes: false
    }
  },
  {
    name: "HV-71",
    city: "Jönköping",
    level: 35,
    country: "SE",
    arena: {
      level: 3,
      standing: 25,
      seats: 30,
      boxes: false
    }
  },
  {
    name: "Djurgården",
    city: "Tukholma",
    level: 35,
    country: "SE",
    arena: {
      level: 5,
      standing: 0,
      seats: 125,
      boxes: true
    }
  },
  {
    name: "AIK",
    city: "Tukholma",
    level: 34,
    country: "SE",
    arena: {
      level: 5,
      standing: 0,
      seats: 125,
      boxes: true
    }
  },
  {
    name: "Brynäs",
    city: "Gävle",
    level: 33,
    country: "SE",
    arena: {
      level: 2,
      standing: 30,
      seats: 25,
      boxes: false
    }
  },
  {
    name: "Malmö",
    city: "Malmö",
    level: 34,
    country: "SE",
    arena: {
      level: 5,
      standing: 0,
      seats: 122,
      boxes: true
    }
  },
  {
    name: "Frölunda",
    city: "Götebord",
    level: 34,
    country: "SE",
    arena: {
      level: 5,
      standing: 0,
      seats: 110,
      boxes: true
    }
  },
  {
    name: "Timrå",
    city: "Timrå",
    level: 33,
    country: "SE",
    arena: {
      level: 3,
      standing: 20,
      seats: 40,
      boxes: false
    }
  },
  {
    name: "Leksand",
    city: "Leksand",
    level: 33,
    country: "SE",
    arena: {
      level: 3,
      standing: 12,
      seats: 43,
      boxes: false
    }
  },
  {
    name: "Haie",
    city: "Köln",
    level: 31,
    country: "DE",
    arena: {
      level: 2,
      standing: 30,
      seats: 30,
      boxes: false
    }
  },
  {
    name: "Huskies",
    city: "Kassel",
    level: 32,
    country: "DE",
    arena: {
      level: 3,
      standing: 20,
      seats: 35,
      boxes: false
    }
  },
  {
    name: "Adler",
    city: "Mannheim",
    level: 29,
    country: "DE",
    arena: {
      level: 3,
      standing: 25,
      seats: 23,
      boxes: false
    }
  },
  {
    name: "Eisbären",
    city: "Berliini",
    level: 31,
    country: "DE",
    arena: {
      level: 3,
      standing: 10,
      seats: 50,
      boxes: false
    }
  },
  {
    name: "Lions",
    city: "Frankfurt",
    level: 31,
    country: "DE",
    arena: {
      level: 3,
      standing: 10,
      seats: 64,
      boxes: false
    }
  },
  {
    name: "Moskitos",
    city: "Essen",
    level: 30,
    country: "DE",
    arena: {
      level: 3,
      standing: 10,
      seats: 65,
      boxes: false
    }
  },
  {
    name: "Capitals",
    city: "Berliini",
    level: 31,
    country: "DE",
    arena: {
      level: 4,
      standing: 11,
      seats: 74,
      boxes: false
    }
  },
  {
    name: "Landshut",
    city: "Landshut",
    level: 29,
    country: "DE",
    arena: {
      level: 3,
      standing: 22,
      seats: 40,
      boxes: false
    }
  },

  {
    name: "Sparta",
    city: "Praha",
    level: 34,
    country: "CZ",
    arena: {
      level: 2,
      standing: 30,
      seats: 40,
      boxes: false
    }
  },
  {
    name: "Budejovice",
    city: "Budejovice",
    level: 34,
    country: "CZ",
    arena: {
      level: 3,
      standing: 25,
      seats: 38,
      boxes: false
    }
  },
  {
    name: "Vitkovice",
    city: "Ostrava",
    level: 33,
    country: "CZ",
    arena: {
      level: 3,
      standing: 31,
      seats: 33,
      boxes: false
    }
  },
  {
    name: "HC Petra",
    city: "Vsetin",
    level: 33,
    country: "CZ",
    arena: {
      level: 2,
      standing: 50,
      seats: 23,
      boxes: false
    }
  },
  {
    name: "Pardubice",
    city: "Pardubice",
    level: 34,
    country: "CZ",
    arena: {
      level: 3,
      standing: 20,
      seats: 30,
      boxes: false
    }
  },
  {
    name: "HC Kladno",
    city: "Kladno",
    level: 35,
    country: "CZ",
    arena: {
      level: 4,
      standing: 25,
      seats: 38,
      boxes: false
    }
  },
  {
    name: "Plzen",
    city: "Plzen",
    level: 32,
    country: "CZ",
    arena: {
      level: 3,
      standing: 20,
      seats: 38,
      boxes: false
    }
  },
  {
    name: "Slavia",
    city: "Praha",
    level: 32,
    country: "CZ",
    arena: {
      level: 3,
      standing: 27,
      seats: 40,
      boxes: false
    }
  },

  {
    name: "SKA",
    city: "Pietari",
    level: 32,
    country: "RU",
    arena: {
      level: 2,
      standing: 40,
      seats: 40,
      boxes: false
    }
  },
  {
    name: "Dynamo",
    city: "Moskova",
    level: 33,
    country: "RU",
    arena: {
      level: 2,
      standing: 40,
      seats: 40,
      boxes: false
    }
  },
  {
    name: "Torpedo",
    city: "Jaroslavl",
    level: 34,
    country: "RU",
    arena: {
      level: 3,
      standing: 20,
      seats: 40,
      boxes: false
    }
  },
  {
    name: "Lada",
    city: "Togliatti",
    level: 34,
    country: "RU",
    arena: {
      level: 3,
      standing: 27,
      seats: 46,
      boxes: false
    }
  },
  {
    name: "Metallurg",
    city: "Magnitogorsk",
    level: 35,
    country: "RU",
    arena: {
      level: 3,
      standing: 30,
      seats: 30,
      boxes: false
    }
  },
  {
    name: "Bars",
    city: "Kazan",
    level: 34,
    country: "RU",
    arena: {
      level: 2,
      standing: 36,
      seats: 29,
      boxes: false
    }
  },
  {
    name: "Lokomotiv",
    city: "Jaroslavl",
    level: 33,
    country: "RU",
    arena: {
      level: 2,
      standing: 28,
      seats: 37,
      boxes: false
    }
  },
  {
    name: "Avangard",
    city: "Omsk",
    level: 32,
    country: "RU",
    arena: {
      level: 2,
      standing: 24,
      seats: 39,
      boxes: false
    }
  },

  {
    name: "Davos",
    city: "Davos",
    level: 34,
    country: "CH",
    arena: {
      level: 3,
      standing: 19,
      seats: 50,
      boxes: false
    }
  },
  {
    name: "Bern",
    city: "Bern",
    level: 33,
    country: "CH",
    arena: {
      level: 4,
      standing: 16,
      seats: 60,
      boxes: false
    }
  },
  {
    name: "Zug",
    city: "Zug",
    level: 32,
    country: "CH",
    arena: {
      level: 3,
      standing: 25,
      seats: 27,
      boxes: false
    }
  },
  {
    name: "Rapperswil",
    city: "Rapperswil",
    level: 32,
    country: "CH",
    arena: {
      level: 2,
      standing: 40,
      seats: 17,
      boxes: false
    }
  },
  {
    name: "Lions",
    city: "Zürich",
    level: 33,
    country: "CH",
    arena: {
      level: 3,
      standing: 40,
      seats: 33,
      boxes: false
    }
  },
  {
    name: "Kloten",
    city: "Kloten",
    level: 35,
    country: "CH",
    arena: {
      level: 3,
      standing: 25,
      seats: 34,
      boxes: false
    }
  },
  {
    name: "EHC Chur",
    city: "Chur",
    level: 32,
    country: "CH",
    arena: {
      level: 3,
      standing: 35,
      seats: 31,
      boxes: false
    }
  },
  {
    name: "Lugano",
    city: "Lugano",
    level: 33,
    country: "CH",
    arena: {
      level: 3,
      standing: 25,
      seats: 33,
      boxes: false
    }
  },
  {
    name: "Fribourg",
    city: "Fribourg",
    level: 33,
    country: "CH",
    arena: {
      level: 3,
      standing: 35,
      seats: 40,
      boxes: false
    }
  },

  {
    name: "Slovan",
    city: "Bratislava",
    level: 32,
    country: "SK",
    arena: {
      level: 3,
      standing: 40,
      seats: 30,
      boxes: false
    }
  },
  {
    name: "Dukla",
    city: "Trencin",
    level: 31,
    country: "SK",
    arena: {
      level: 2,
      standing: 20,
      seats: 31,
      boxes: false
    }
  },
  {
    name: "Kosice",
    city: "Kosice",
    level: 32,
    country: "SK",
    arena: {
      level: 2,
      standing: 52,
      seats: 25,
      boxes: false
    }
  },

  {
    name: "HC Bolzano",
    city: "Bolzano",
    level: 27,
    country: "IT",
    arena: {
      level: 2,
      standing: 33,
      seats: 20,
      boxes: false
    }
  },
  {
    name: "Devils",
    city: "Milano",
    level: 28,
    country: "IT",
    arena: {
      level: 3,
      standing: 24,
      seats: 22,
      boxes: false
    }
  },
  {
    name: "Brunico",
    city: "Brunico",
    level: 27,
    country: "IT",
    arena: {
      level: 3,
      standing: 19,
      seats: 27,
      boxes: false
    }
  },

  {
    name: "FeldKirch",
    city: "Feldkirch",
    level: 28,
    country: "AT",
    arena: {
      level: 2,
      standing: 25,
      seats: 26,
      boxes: false
    }
  },
  {
    name: "Lustenau",
    city: "Lustenau",
    level: 27,
    country: "AT",
    arena: {
      level: 2,
      standing: 20,
      seats: 20,
      boxes: false
    }
  },
  {
    name: "Välk-494",
    city: "Tartto",
    level: 23,
    country: "EE",
    arena: {
      level: 2,
      standing: 15,
      seats: 10,
      boxes: false
    }
  },

  {
    name: "Trondheim",
    city: "Trondheim",
    level: 25,
    country: "NO",
    arena: {
      level: 3,
      standing: 20,
      seats: 23,
      boxes: false
    }
  },
  {
    name: "Vålerengen",
    city: "Oslo",
    level: 26,
    country: "NO",
    arena: {
      level: 3,
      standing: 20,
      seats: 20,
      boxes: false
    }
  },

  {
    name: "Rouen",
    city: "Rouen",
    level: 30,
    country: "FR",
    arena: {
      level: 2,
      standing: 35,
      seats: 10,
      boxes: false
    }
  },
  {
    name: "Amiens",
    city: "Somme",
    level: 28,
    country: "FR",
    arena: {
      level: 2,
      standing: 30,
      seats: 6,
      boxes: false
    }
  },
  {
    name: "Brest",
    city: "Brest",
    level: 27,
    country: "FR",
    arena: {
      level: 2,
      standing: 14,
      seats: 15,
      boxes: false
    }
  },
  {
    name: "Angers",
    city: "Angers",
    level: 26,
    country: "FR",
    arena: {
      level: 1,
      standing: 20,
      seats: 6,
      boxes: false
    }
  },
  {
    name: "Caen",
    city: "Caen",
    level: 27,
    country: "FR",
    arena: {
      level: 2,
      standing: 22,
      seats: 25,
      boxes: false
    }
  },

  {
    name: "Podhale",
    city: "Nowy Targ",
    level: 30,
    country: "PL",
    arena: {
      level: 3,
      standing: 26,
      seats: 29,
      boxes: false
    }
  },
  {
    name: "KS Unia",
    city: "Osviciem",
    level: 29,
    country: "PL",
    arena: {
      level: 3,
      standing: 22,
      seats: 22,
      boxes: false
    }
  },

  {
    name: "HC Niks",
    city: "Riika",
    level: 29,
    country: "LV",
    arena: {
      level: 3,
      standing: 21,
      seats: 30,
      boxes: false
    }
  },

  {
    name: "Tigers",
    city: "Amsterdam",
    level: 20,
    country: "NL",
    arena: {
      level: 2,
      standing: 33,
      seats: 12,
      boxes: false
    }
  },
  {
    name: "Aris",
    city: "Salonika",
    level: 18,
    country: "GR",
    arena: {
      level: 2,
      standing: 12,
      seats: 12,
      boxes: false
    }
  },
  {
    name: "Flyers",
    city: "Dublin",
    level: 20,
    country: "IE",
    arena: {
      level: 2,
      standing: 5,
      seats: 30,
      boxes: false
    }
  },
  {
    name: "Chiefs",
    city: "Leuven",
    level: 21,
    country: "BE",
    arena: {
      level: 2,
      standing: 10,
      seats: 20,
      boxes: false
    }
  },
  {
    name: "Pagodromoi",
    city: "Ateena",
    level: 19,
    country: "GR",
    arena: {
      level: 4,
      standing: 10,
      seats: 60,
      boxes: false
    }
  },
  {
    name: "Storm",
    city: "Manchester",
    level: 26,
    country: "GR",
    arena: {
      level: 6,
      standing: 0,
      seats: 250,
      boxes: true
    }
  },
  {
    name: "Jesters",
    city: "Newcastle",
    level: 25,
    country: "GB",
    arena: {
      level: 5,
      standing: 0,
      seats: 125,
      boxes: true
    }
  },
  {
    name: "Herning",
    city: "Herning",
    level: 24,
    country: "DK",
    arena: {
      level: 2,
      standing: 22,
      seats: 23,
      boxes: false
    }
  },
  {
    name: "Mighty Ducks",
    city: "Anaheim",
    level: 37,
    country: "US",
    arena: {
      level: 5,
      standing: 0,
      seats: 136,
      boxes: true
    }
  },
  {
    name: "Blackhawks",
    city: "Chicago",
    level: 38,
    country: "US",
    arena: {
      level: 6,
      standing: 0,
      seats: 147,
      boxes: true
    }
  },
  {
    name: "Bruins",
    city: "Boston",
    level: 38,
    country: "US",
    arena: {
      level: 6,
      standing: 0,
      seats: 152,
      boxes: true
    }
  },
  {
    name: "Avalanche",
    city: "Colorado",
    level: 41,
    country: "US",
    arena: {
      level: 4,
      standing: 0,
      seats: 119,
      boxes: true
    }
  },
  {
    name: "Predators",
    city: "Nashville",
    level: 36,
    country: "US",
    arena: {
      level: 5,
      standing: 0,
      seats: 130,
      boxes: true
    }
  },
  {
    name: "Panthers",
    city: "Florida",
    level: 38,
    country: "US",
    arena: {
      level: 5,
      standing: 0,
      seats: 116,
      boxes: true
    }
  },
  {
    name: "Stars",
    city: "Dallas",
    level: 42,
    country: "US",
    arena: {
      level: 6,
      standing: 0,
      seats: 179,
      boxes: true
    }
  },
  {
    name: "Red Wings",
    city: "Detroit",
    level: 42,
    country: "US",
    arena: {
      level: 6,
      standing: 0,
      seats: 190,
      boxes: true
    }
  },
  {
    name: "Rangers",
    city: "New York",
    level: 39,
    country: "US",
    arena: {
      level: 4,
      standing: 20,
      seats: 100,
      boxes: true
    }
  },
  {
    name: "Kings",
    city: "Los Angeles",
    level: 41,
    country: "US",
    arena: {
      level: 4,
      standing: 0,
      seats: 137,
      boxes: true
    }
  },
  {
    name: "Canadiens",
    city: "Montreal",
    level: 39,
    country: "CA",
    arena: {
      level: 6,
      standing: 0,
      seats: 162,
      boxes: true
    }
  },
  {
    name: "Canucks",
    city: "Vancouver",
    level: 39,
    country: "CA",
    arena: {
      level: 5,
      standing: 0,
      seats: 155,
      boxes: true
    }
  },
  {
    name: "Capitals",
    city: "Washington",
    level: 39,
    country: "US",
    arena: {
      level: 5,
      standing: 0,
      seats: 150,
      boxes: true
    }
  },
  {
    name: "Lightning",
    city: "Tampa Bay",
    level: 36,
    country: "US",
    arena: {
      level: 6,
      standing: 0,
      seats: 250,
      boxes: true
    }
  },
  {
    name: "Oilers",
    city: "Edmonton",
    level: 42,
    country: "CA",
    arena: {
      level: 4,
      standing: 20,
      seats: 100,
      boxes: true
    }
  },
  {
    name: "Flyers",
    city: "Philadelphia",
    level: 42,
    country: "US",
    arena: {
      level: 4,
      standing: 20,
      seats: 100,
      boxes: true
    }
  },
  {
    name: "Penguins",
    city: "Pittsburgh",
    level: 39,
    country: "US",
    arena: {
      level: 4,
      standing: 20,
      seats: 100,
      boxes: true
    }
  },
  {
    name: "Coyotes",
    city: "Phoenix",
    level: 39,
    country: "US",
    arena: {
      level: 4,
      standing: 20,
      seats: 100,
      boxes: true
    }
  },
  {
    name: "Sabres",
    city: "Buffalo",
    level: 39,
    country: "US",
    arena: {
      level: 4,
      standing: 20,
      seats: 100,
      boxes: true
    }
  },
  {
    name: "Islanders",
    city: "New York",
    level: 39,
    country: "US",
    arena: {
      level: 4,
      standing: 20,
      seats: 100,
      boxes: true
    }
  }
];

export default teamList;

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
