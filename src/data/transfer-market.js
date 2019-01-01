import { List } from "immutable";
import r from "../services/random";

const playerTypes = List.of(
  {
    description: "Ykkösdivisioonan vakiopelaaja",
    buy: 145000,
    sell: 60000,
    skill: () => r.integer(0, 3) + 1
  },
  {
    description: "Ykkösdivisioonan huippupelaaja",
    buy: 215000,
    sell: 90000,
    skill: () => r.integer(0, 4) + 2
  },
  {
    description: "Perustason liigapelaaja",
    buy: 280000,
    sell: 110000,
    skill: () => r.integer(0, 5) + 3
  },
  {
    description: "Huipputason liigapelaaja",
    buy: 370000,
    sell: 160000,
    skill: () => r.integer(0, 7) + 4
  },
  {
    description: "Ulkomailla pelaava kotimainen ammattilaiskiekkoilija",
    buy: 580000,
    sell: 280000,
    skill: () => r.integer(0, 4) + 10
  },
  {
    description: "Ulkomaalaisvahvistus (taidoista ei tarkkaa tietoa)",
    buy: 530000,
    sell: 265000,
    skill: () => r.integer(0, 16) + 2
  },
  {
    description: "NHL-tasoinen ulkomaalaisvahvistus",
    buy: 1000000,
    sell: 500000,
    skill: () => r.integer(0, 10) + 16
  }
);

export default playerTypes;
