import { List, Map } from "immutable";
import r from "../services/random";

const teams = List.of(
  Map({ name: "KalPa", strength: () => 95, domestic: true }),
  Map({ name: "Jokerit", strength: () => 221, domestic: true }),
  Map({ name: "TPS", strength: () => 250, domestic: true }),
  Map({ name: "JyP HT", strength: () => 158, domestic: true }),
  Map({ name: "HPK", strength: () => 155, domestic: true }),
  Map({ name: "HIFK", strength: () => 260, domestic: true }),
  Map({ name: "Ilves", strength: () => 262, domestic: true }),
  Map({ name: "Tappara", strength: () => 180, domestic: true }),
  Map({ name: "Kiekko-Espoo", strength: () => 185, domestic: true }),
  Map({ name: "Lukko", strength: () => 160, domestic: true }),
  Map({ name: "Ässät", strength: () => 220, domestic: true }),
  Map({ name: "SaiPa", strength: () => 195, domestic: true }),
  Map({ name: "Maso HT", strength: () => 65, domestic: true }),
  Map({ name: "Karhut", strength: () => 80, domestic: true }),
  Map({ name: "Kärpät", strength: () => 145, domestic: true }),
  Map({ name: "TuTo", strength: () => 65, domestic: true }),
  Map({ name: "Hermes", strength: () => 96, domestic: true }),
  Map({ name: "Pelicans", strength: () => 99, domestic: true }),
  Map({ name: "Diskos", strength: () => 55, domestic: true }),
  Map({ name: "Jääkotkat", strength: () => 40, domestic: true }),
  Map({ name: "SaPKo", strength: () => 74, domestic: true }),
  Map({ name: "Haukat", strength: () => 55, domestic: true }),
  Map({ name: "Ahmat", strength: () => 40, domestic: true }),
  Map({ name: "Sport", strength: () => 80, domestic: true }),

  Map({ name: "Luleå", strength: () => r.integer(240, 320), domestic: false }),
  Map({
    name: "Djurgården",
    strength: () => r.integer(210, 240),
    domestic: false
  }),
  Map({
    name: "Västra Frölunda",
    strength: () => r.integer(200, 240),
    domestic: false
  }),
  Map({
    name: "Sparta Praha",
    strength: () => r.integer(180, 270),
    domestic: false
  }),
  Map({
    name: "Budejovice",
    strength: () => r.integer(160, 230),
    domestic: false
  }),
  Map({ name: "Dukla", strength: () => r.integer(160, 190), domestic: false }),
  Map({ name: "Lada", strength: () => r.integer(140, 290), domestic: false }),
  Map({
    name: "ZSKA Moskova",
    strength: () => r.integer(170, 240),
    domestic: false
  }),
  Map({
    name: "Vålerengen",
    strength: () => r.integer(130, 160),
    domestic: false
  }),
  Map({
    name: "Preussen Berlin",
    strength: () => r.integer(180, 210),
    domestic: false
  }),
  Map({
    name: "Eisbären",
    strength: () => r.integer(170, 220),
    domestic: false
  }),
  Map({
    name: "Feldkirch",
    strength: () => r.integer(155, 205),
    domestic: false
  }),
  Map({ name: "Rouen", strength: () => r.integer(85, 155), domestic: false }),
  Map({
    name: "Manchester Storm",
    strength: () => r.integer(85, 115),
    domestic: false
  }),
  Map({ name: "Kosice", strength: () => r.integer(175, 195), domestic: false }),
  Map({ name: "Davos", strength: () => r.integer(195, 210), domestic: false }),
  Map({
    name: "Milano Devils",
    strength: () => r.integer(120, 135),
    domestic: false
  }),
  Map({
    name: "Olimpija Ljubljana",
    strength: () => r.integer(90, 120),
    domestic: false
  }),
  Map({
    name: "Medveščak Zagreb",
    strength: () => r.integer(100, 130),
    domestic: false
  }),
  Map({
    name: "HC Bolzano",
    strength: () => r.integer(80, 140),
    domestic: false
  }),
  Map({
    name: "HC Barcelona",
    strength: () => r.integer(50, 100),
    domestic: false
  }),
  Map({
    name: "Lugano",
    strength: () => r.integer(175, 250),
    domestic: false
  }),
  Map({
    name: "Ambri-Piotta",
    strength: () => r.integer(150, 220),
    domestic: false
  }),
  Map({
    name: "AIK Tukholma",
    strength: () => r.integer(230, 275),
    domestic: false
  }),
  Map({
    name: "Petra Vsetín",
    strength: () => r.integer(190, 280),
    domestic: false
  })
).map((t, i) => t.set("id", i));

export default teams;
