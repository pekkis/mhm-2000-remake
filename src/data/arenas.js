import { List, Map } from "immutable";

const price = level => 100000 + 200000 * level;

const arenas = List.of(
  Map({
    name: "Ulkohuussi",
    price: () => 0
  }),
  Map({
    name: "Navetta",
    price: price(1)
  }),
  Map({
    name: "Lato",
    price: price(2)
  }),
  Map({
    name: "Pieni perushalli",
    price: price(3)
  }),
  Map({
    name: "Perushalli",
    price: price(4)
  }),
  Map({
    name: "Mainio jäähalli",
    price: price(5)
  }),
  Map({
    name: "Upea jäähalli aitioineen",
    price: price(6)
  }),
  Map({
    name: "NHL-kelpoinen superjäähalli",
    price: price(7)
  }),
  Map({
    name: "Typhoon-luokan viihdekeskus",
    price: price(8)
  }),
  Map({
    name: "Hjallis-luokan monitoimihalli",
    price: price(9)
  })
).map((a, k) => a.set("id", k));

export default arenas;
