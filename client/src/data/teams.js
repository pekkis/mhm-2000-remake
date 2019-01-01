import { List, Map } from "immutable";
import r from "../services/random";

const teams = List.of(
  Map({ name: "KalPa", strength: () => 95 }),
  Map({ name: "Jokerit", strength: () => 221 }),
  Map({ name: "TPS", strength: () => 250 }),
  Map({ name: "JyP HT", strength: () => 158 }),
  Map({ name: "HPK", strength: () => 155 }),
  Map({ name: "HIFK", strength: () => 260 }),
  Map({ name: "Ilves", strength: () => 262 }),
  Map({ name: "Tappara", strength: () => 180 }),
  Map({ name: "Kiekko-Espoo", strength: () => 185 }),
  Map({ name: "Lukko", strength: () => 160 }),
  Map({ name: "Ässät", strength: () => 220 }),
  Map({ name: "SaiPa", strength: () => 195 }),
  Map({ name: "Maso HT", strength: () => 65 }),
  Map({ name: "Karhut", strength: () => 80 }),
  Map({ name: "Kärpät", strength: () => 145 }),
  Map({ name: "TuTo", strength: () => 65 }),
  Map({ name: "Hermes", strength: () => 96 }),
  Map({ name: "Pelicans", strength: () => 99 }),
  Map({ name: "Diskos", strength: () => 55 }),
  Map({ name: "Jääkotkat", strength: () => 40 }),
  Map({ name: "SaPKo", strength: () => 74 }),
  Map({ name: "Haukat", strength: () => 55 }),
  Map({ name: "Ahmat", strength: () => 40 }),
  Map({ name: "Sport", strength: () => 80 }),

  Map({ name: "Luleå", strength: () => r.integer(240, 320) }),
  Map({ name: "Djurgården", strength: () => r.integer(210, 240) }),
  Map({ name: "Frölunda", strength: () => r.integer(200, 240) }),
  Map({ name: "Sparta Praha", strength: () => r.integer(180, 270) }),
  Map({ name: "Budejovice", strength: () => r.integer(160, 230) }),
  Map({ name: "Dukla", strength: () => r.integer(160, 190) }),
  Map({ name: "Lada", strength: () => r.integer(140, 290) }),
  Map({ name: "ZSKA Moskova", strength: () => r.integer(170, 240) }),
  Map({ name: "Vålerengen", strength: () => r.integer(130, 160) }),
  Map({ name: "Preussen Berlin", strength: () => r.integer(180, 210) }),
  Map({ name: "Eisbären", strength: () => r.integer(170, 220) }),
  Map({ name: "Feldkirch", strength: () => r.integer(155, 205) }),
  Map({ name: "Rouen", strength: () => r.integer(85, 155) }),
  Map({ name: "Manchester Storm", strength: () => r.integer(85, 115) }),
  Map({ name: "Kosice", strength: () => r.integer(175, 195) }),
  Map({ name: "Davos", strength: () => r.integer(195, 210) }),
  Map({ name: "Milano Devils", strength: () => r.integer(120, 135) })
).map((t, i) => t.set("id", i));

export default teams;
