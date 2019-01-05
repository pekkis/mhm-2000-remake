import { List, Map } from "immutable";
import { cinteger } from "../services/random";

const playerTypes = List.of(
  Map({
    description: "Ykkösdivisioonan vakiopelaaja",
    buy: 145000,
    sell: 60000,
    skill: () => cinteger(0, 3) + 1
  }),
  Map({
    description: "Ykkösdivisioonan huippupelaaja",
    buy: 215000,
    sell: 90000,
    skill: () => cinteger(0, 4) + 2
  }),
  Map({
    description: "Perustason liigapelaaja",
    buy: 280000,
    sell: 110000,
    skill: () => cinteger(0, 5) + 3
  }),
  Map({
    description: "Huipputason liigapelaaja",
    buy: 370000,
    sell: 160000,
    skill: () => cinteger(0, 7) + 4
  }),
  Map({
    description: "Ulkomailla pelaava kotimainen ammattilaiskiekkoilija",
    buy: 580000,
    sell: 280000,
    skill: () => cinteger(0, 4) + 10
  }),
  Map({
    description: "Ulkomaalaisvahvistus (taidoista ei tarkkaa tietoa)",
    buy: 530000,
    sell: 265000,
    skill: () => cinteger(0, 16) + 2
  }),
  Map({
    description: "NHL-tasoinen ulkomaalaisvahvistus",
    buy: 1000000,
    sell: 500000,
    skill: () => cinteger(0, 10) + 16
  })
);

export default playerTypes;
