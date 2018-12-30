import { List, Map } from "immutable";

const teams = List.of(
  Map({ name: "KalPa", strength: 95 }),
  Map({ name: "Jokerit", strength: 221 }),
  Map({ name: "TPS", strength: 250 }),
  Map({ name: "JyP HT", strength: 158 }),
  Map({ name: "HPK", strength: 155 }),
  Map({ name: "HIFK", strength: 260 }),
  Map({ name: "Ilves", strength: 262 }),
  Map({ name: "Tappara", strength: 180 }),
  Map({ name: "Kiekko-Espoo", strength: 185 }),
  Map({ name: "Lukko", strength: 160 }),
  Map({ name: "Ässät", strength: 220 }),
  Map({ name: "SaiPa", strength: 195 }),
  Map({ name: "Maso HT", strength: 65 }),
  Map({ name: "Karhut", strength: 80 }),
  Map({ name: "Kärpät", strength: 145 }),
  Map({ name: "TuTo", strength: 65 }),
  Map({ name: "Hermes", strength: 96 }),
  Map({ name: "Pelicans", strength: 99 }),
  Map({ name: "Diskos", strength: 55 }),
  Map({ name: "Jääkotkat", strength: 40 }),
  Map({ name: "SaPKo", strength: 74 }),
  Map({ name: "Haukat", strength: 55 }),
  Map({ name: "Ahmat", strength: 40 }),
  Map({ name: "Sport", strength: 80 })
).map((t, i) => t.set("id", i));

export default teams;
