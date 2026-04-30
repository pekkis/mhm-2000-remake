import r from "@/services/random";

export type TeamDefinition = {
  id: number;
  name: string;
  strength: () => number;
  domestic: boolean;
};

const teams: TeamDefinition[] = [
  { id: 0, name: "KalPa", strength: () => 95, domestic: true },
  { id: 1, name: "Jokerit", strength: () => 221, domestic: true },
  { id: 2, name: "TPS", strength: () => 250, domestic: true },
  { id: 3, name: "JyP HT", strength: () => 158, domestic: true },
  { id: 4, name: "HPK", strength: () => 155, domestic: true },
  { id: 5, name: "HIFK", strength: () => 260, domestic: true },
  { id: 6, name: "Ilves", strength: () => 262, domestic: true },
  { id: 7, name: "Tappara", strength: () => 180, domestic: true },
  { id: 8, name: "Kiekko-Espoo", strength: () => 185, domestic: true },
  { id: 9, name: "Lukko", strength: () => 160, domestic: true },
  { id: 10, name: "Ässät", strength: () => 220, domestic: true },
  { id: 11, name: "SaiPa", strength: () => 195, domestic: true },
  { id: 12, name: "Maso HT", strength: () => 65, domestic: true },
  { id: 13, name: "Karhut", strength: () => 80, domestic: true },
  { id: 14, name: "Kärpät", strength: () => 145, domestic: true },
  { id: 15, name: "TuTo", strength: () => 65, domestic: true },
  { id: 16, name: "Hermes", strength: () => 96, domestic: true },
  { id: 17, name: "Pelicans", strength: () => 99, domestic: true },
  { id: 18, name: "Diskos", strength: () => 55, domestic: true },
  { id: 19, name: "Jääkotkat", strength: () => 40, domestic: true },
  { id: 20, name: "SaPKo", strength: () => 74, domestic: true },
  { id: 21, name: "Haukat", strength: () => 55, domestic: true },
  { id: 22, name: "Ahmat", strength: () => 40, domestic: true },
  { id: 23, name: "Sport", strength: () => 80, domestic: true },
  {
    id: 24,
    name: "Luleå",
    strength: () => r.integer(240, 320),
    domestic: false
  },
  {
    id: 25,
    name: "Djurgården",
    strength: () => r.integer(210, 240),
    domestic: false
  },
  {
    id: 26,
    name: "Västra Frölunda",
    strength: () => r.integer(200, 240),
    domestic: false
  },
  {
    id: 27,
    name: "Sparta Praha",
    strength: () => r.integer(180, 270),
    domestic: false
  },
  {
    id: 28,
    name: "Budejovice",
    strength: () => r.integer(160, 230),
    domestic: false
  },
  {
    id: 29,
    name: "Dukla",
    strength: () => r.integer(160, 190),
    domestic: false
  },
  {
    id: 30,
    name: "Lada",
    strength: () => r.integer(140, 290),
    domestic: false
  },
  {
    id: 31,
    name: "ZSKA Moskova",
    strength: () => r.integer(170, 240),
    domestic: false
  },
  {
    id: 32,
    name: "Vålerengen",
    strength: () => r.integer(130, 160),
    domestic: false
  },
  {
    id: 33,
    name: "Preussen Berlin",
    strength: () => r.integer(180, 210),
    domestic: false
  },
  {
    id: 34,
    name: "Eisbären",
    strength: () => r.integer(170, 220),
    domestic: false
  },
  {
    id: 35,
    name: "Feldkirch",
    strength: () => r.integer(155, 205),
    domestic: false
  },
  {
    id: 36,
    name: "Rouen",
    strength: () => r.integer(85, 155),
    domestic: false
  },
  {
    id: 37,
    name: "Manchester Storm",
    strength: () => r.integer(85, 115),
    domestic: false
  },
  {
    id: 38,
    name: "Kosice",
    strength: () => r.integer(175, 195),
    domestic: false
  },
  {
    id: 39,
    name: "Davos",
    strength: () => r.integer(195, 210),
    domestic: false
  },
  {
    id: 40,
    name: "Milano Devils",
    strength: () => r.integer(120, 135),
    domestic: false
  },
  {
    id: 41,
    name: "Olimpija Ljubljana",
    strength: () => r.integer(90, 120),
    domestic: false
  },
  {
    id: 42,
    name: "Medveščak Zagreb",
    strength: () => r.integer(100, 130),
    domestic: false
  },
  {
    id: 43,
    name: "HC Bolzano",
    strength: () => r.integer(80, 140),
    domestic: false
  },
  {
    id: 44,
    name: "HC Barcelona",
    strength: () => r.integer(50, 100),
    domestic: false
  },
  {
    id: 45,
    name: "Lugano",
    strength: () => r.integer(175, 250),
    domestic: false
  },
  {
    id: 46,
    name: "Ambri-Piotta",
    strength: () => r.integer(150, 220),
    domestic: false
  },
  {
    id: 47,
    name: "AIK Tukholma",
    strength: () => r.integer(230, 275),
    domestic: false
  },
  {
    id: 48,
    name: "Petra Vsetín",
    strength: () => r.integer(190, 280),
    domestic: false
  }
];

export default teams;
