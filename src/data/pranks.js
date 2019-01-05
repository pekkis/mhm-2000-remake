import { OrderedMap, Map, List } from "immutable";

const pranks = OrderedMap({
  protest: Map({
    name: "Protesti",
    eventName: "protest",
    victimless: false,
    price: competitions => {
      return 0;
    },
    execute: function*(prank) {
      console.log("PROTEST FUCKING TIME");
    }
  }),
  playerHooking: Map({
    name: "Huumausaineiden myynti pelaajille",
    eventName: "bazookaStrike",
    victimless: true,
    price: competitions => {
      return 150000;
    },
    execute: function*(prank) {}
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
    name: "Vastustajan lahjonta",
    eventName: "fixedMatch",
    victimless: true,
    price: competitions => {
      return false;
    },
    execute: function*(prank) {}
  })
});

export default pranks;
