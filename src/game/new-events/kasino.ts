import random from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "kasino";

export type KasinoData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  amount: number;
  /** Did the player place a bet at all? Set on resolve. */
  participate?: boolean;
  /** Roulette outcome — rolled at resolve time. Only meaningful if `participate`. */
  success?: boolean;
};

/**
 * Kasino — interactive gamble. Player picks red, black, or abstains.
 * Win triples the wager; lose drops it. The roll happens at resolve
 * time and the outcome lives on the stored payload, so `process`
 * stays pure and the result survives save/load mid-resolution.
 *
 * 1-1 port of `@/game/events/kasino.ts`. Template for any event that
 * had `random.*` calls in the saga's `process`.
 */
const kasino: DeclarativeEvent<KasinoData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: false,
    amount: 150000
  }),

  options: () => ({
    p: "Kaikki punaiselle!",
    m: "Kaikki mustalle!",
    e: "Ei. Uhkapeli on syntiä."
  }),

  resolve: (_ctx, data, value) => {
    if (value === "e") {
      return { ...data, resolved: true, participate: false };
    }
    return {
      ...data,
      resolved: true,
      participate: true,
      success: random.pick([true, false])
    };
  },

  render: (data) => {
    const lines = [
      `Olet eräänä iltana kasinolla.

  Yhtäkkiä ääni päässäsi sanoo: 'Laita ${data.amount} pekkaa joukkueen kassasta peliin, niin voitto on sinun!' Otatko riskin?`
    ];

    if (!data.resolved) {
      return lines;
    }

    if (!data.participate) {
      lines.push("Pelkuri.");
      return lines;
    }

    if (!data.success) {
      lines.push(`Hävisit. Voi voi sentään...`);
      return lines;
    }

    lines.push(
      `JESS! Voitit omasi takaisin sekä ${data.amount * 3} pekkaa lisää!`
    );
    return lines;
  },

  process: (_ctx, data) => {
    if (!data.participate) {
      return [];
    }

    const effect: EventEffect = data.success
      ? {
          type: "incrementBalance",
          manager: data.manager,
          amount: data.amount * 3
        }
      : {
          type: "decrementBalance",
          manager: data.manager,
          amount: data.amount
        };

    return [effect];
  }
};

export default kasino;
