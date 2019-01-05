import { OrderedMap, Map, List } from "immutable";

const pranks = OrderedMap({
  protest: Map({
    name: "Protesti",
    eventName: "protest",
    victimless: false,
    price: competitions => {
      return 0;
    }
  }),
  playerHooking: Map({
    name: "Huumausaineiden myynti pelaajille",
    eventName: "bazookaStrike",
    victimless: true,
    price: competitions => {
      return 150000;
    }
  }),
  bazookaStrike: Map({
    name: "Sinkoisku joukkueen matkabussiin",
    eventName: "bazookaStrike",
    victimless: true,
    price: competitions => {
      return 3000000;
    }
  }),
  fixedMatch: Map({
    name: "Seuraavan vastustajan lahjonta",
    eventName: "fixedMatch",
    victimless: true,
    price: competitions => {
      return false;
    }
  })
});

export default pranks;
