import { call } from "redux-saga/effects";
import { OrderedMap, Map, List } from "immutable";
import { addNotification } from "../sagas/notification";
import events from "../data/events";

const pranks = OrderedMap({
  protest: Map({
    name: "Protesti",
    eventName: "protest",
    victimless: false,
    price: competitions => {
      return 0;
    },

    order: function*(prank) {
      yield call(
        addNotification,
        prank.get("manager"),
        `Faksaat protestin jääkiekkoliiton toimistolle. Pian hakulaitteesi jo piippaakin iloisesti: kirjelmä on vastaanotettu, ja se luvataan käsitellä "pikaisesti"`
      );

      console.log("PROTEST FUCKING TIME1 ", prank);
    },

    execute: function*(prank) {
      const protestEvent = events.get("protest");

      yield call(protestEvent.create, prank.toJS());

      console.log("PROTEST FUCKING TIME 2");
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
