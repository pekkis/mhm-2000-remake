import type { GameContext } from "@/state/game-context";
import type { EventEffect } from "@/game/event-effects";

export type PrankInstance = {
  manager: string;
  victim: number;
  type: string;
};

/**
 * Declarative prank definition. `execute(ctx, prank)` returns the
 * effect list to apply when the prank phase resolves. Most pranks
 * spawn a follow-up event (which then runs in the regular event
 * phase); `fixedMatch` directly applies a team effect.
 *
 * Saga-free since the dual-write pivot. Mirrors the shape of
 * `DeclarativeEvent.process`.
 */
export type DeclarativePrank = {
  name: string;
  price: (competition: string) => number;
  orderMessage: (prank: PrankInstance) => string;
  execute: (ctx: GameContext, prank: PrankInstance) => EventEffect[];
};

const pranks: Record<string, DeclarativePrank> = {
  protest: {
    name: "Protesti",
    price: () => 0,

    orderMessage: () =>
      `Faksaat protestin jääkiekkoliiton toimistolle. Pian hakulaitteesi jo piippaakin iloisesti: kirjelmä on vastaanotettu, ja se luvataan käsitellä "pikaisesti"`,

    execute: (_ctx, prank) => [
      {
        type: "spawnEvent",
        eventId: "protest",
        seed: { manager: prank.manager, victim: prank.victim }
      }
    ]
  },
  playerHooking: {
    name: "Huumausaineiden myynti pelaajille",
    price: () => 150000,

    orderMessage: () =>
      `Pikainen soitto Pösilän miehelle, vanhalle ystävällesi ja Helsingin huumemiliisin päällikölle __Ari Jaarniolle__, ja homma hoituu! Jaarnio lupaa lähettää miehensä matkaan alta aikayksikön!`,

    execute: (_ctx, prank) => [
      {
        type: "spawnEvent",
        eventId: "sellNarcotics",
        seed: { manager: prank.manager, victim: prank.victim }
      }
    ]
  },
  fixedMatch: {
    name: "Vastustajan lahjonta",
    price: (competition) => {
      if (competition === "phl") {
        return 300000;
      }
      return 150000;
    },

    orderMessage: () =>
      `Soitat hämäräperäiselle vedonvälittäjälle, ja kerrot mitä tahdot. Hän lupaa hoitaa "asian" hienovaraisesti.`,

    execute: (_ctx, prank) => [
      {
        type: "addTeamEffect",
        team: prank.victim,
        effect: {
          parameter: ["strength"],
          amount: -10000,
          duration: 1
        }
      }
    ]
  },
  bazookaStrike: {
    name: "Sinkoisku joukkueen matkabussiin",
    price: () => 3000000,

    orderMessage: () =>
      `Fanikauppanne vieressä onkin sopivasti moottoripyöräjengi MC Habadobon kerhotila. Ne pojat ovat tottuneet astetta rankempiin välienselvittyihin. Käyt toimittamassa tyypeille salkullisen kylmää käteistä, ja saat lupauksen pikaisesta toimituksesta.`,

    execute: (_ctx, prank) => [
      {
        type: "spawnEvent",
        eventId: "bazookaStrike",
        seed: { manager: prank.manager, victim: prank.victim }
      }
    ]
  }
};

export default pranks;
