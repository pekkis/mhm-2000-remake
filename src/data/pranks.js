import { call } from "redux-saga/effects";
import { OrderedMap, Map, List } from "immutable";
import { addNotification } from "../sagas/notification";
import { addEffect } from "../sagas/team";
import { addEvent } from "../sagas/event";
import events from "../data/events";

const pranks = OrderedMap({
  protest: Map({
    name: "Protesti",
    price: competitions => {
      return 0;
    },

    order: function*(prank) {
      yield call(
        addNotification,
        prank.get("manager"),
        `Faksaat protestin jääkiekkoliiton toimistolle. Pian hakulaitteesi jo piippaakin iloisesti: kirjelmä on vastaanotettu, ja se luvataan käsitellä "pikaisesti"`
      );
    },

    execute: function*(prank) {
      const protestEvent = events.get("protest");
      yield call(protestEvent.create, prank.toJS());
    }
  }),
  playerHooking: Map({
    name: "Huumausaineiden myynti pelaajille",
    price: competition => {
      return 150000;
    },

    order: function*(prank) {
      yield call(
        addNotification,
        prank.get("manager"),
        `Pikainen soitto Pösilän miehelle, vanhalle ystävällesi ja Helsingin huumemiliisin päällikölle __Ari Jaarniolle__, ja homma hoituu! Jaarnio lupaa lähettää miehensä matkaan alta aikayksikön!`
      );
    },

    execute: function*(prank) {
      const event = events.get("sellNarcotics");
      yield call(event.create, prank.toJS());
    }
  }),
  fixedMatch: Map({
    name: "Vastustajan lahjonta",
    price: competition => {
      if (competition === "phl") {
        return 300000;
      }

      return 150000;
    },
    order: function*(prank) {
      yield call(
        addNotification,
        prank.get("manager"),
        `Soitat hämäräperäiselle vedonvälittäjälle, ja kerrot mitä tahdot. Hän lupaa hoitaa "asian" hienovaraisesti.`
      );
    },
    execute: function*(prank) {
      yield addEffect(prank.get("victim"), ["strength"], -10000, 1);
    }
  }),
  bazookaStrike: Map({
    name: "Sinkoisku joukkueen matkabussiin",
    price: competition => {
      return 3000000;
    },
    order: function*(prank) {
      yield call(
        addNotification,
        prank.get("manager"),
        `Fanikauppanne vieressä onkin sopivasti moottoripyöräjengi MC Habadobon kerhotila. Ne pojat ovat tottuneet astetta rankempiin välienselvittyihin. Käyt toimittamassa tyypeille salkullisen kylmää käteistä, ja saat lupauksen pikaisesta toimituksesta.`
      );
    },
    execute: function*(prank) {
      const event = events.get("bazookaStrike");
      yield call(event.create, prank.toJS());
    }
  })
});

export default pranks;
