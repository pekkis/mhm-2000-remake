import { setup, sendTo, assign } from "xstate";

import type { EventEffect } from "@/game/event-effects";
import { amount as formatAmount } from "@/services/format";

/**
 * Parlay payout multipliers indexed by number of correct picks (0..6).
 * 1-1 mirror of `victories` in the deleted `src/sagas/betting.ts`.
 * 0–2 correct → no payout; 3 → 1×, 4 → 2×, 5 → 5×, 6 → 10×.
 */
const victories = [false, false, false, 1, 2, 5, 10] as const;

export type BetInput = {
  manager: string;
  coupon: string[];
  amount: number;
};

type BetContext = BetInput & { correctCoupon: string[] };

export type BetEvent = { type: "RESOLVE"; correctCoupon: string[] };

/**
 * One parlay bet. Spawned by `gameMachine` on `PLACE_BET`, parked in
 * `placed` until the league round runs in `executeGameday` and the
 * parent sends `RESOLVE { correctCoupon }`. On resolution the bet
 * computes its payout as `EventEffect[]` and forwards it to the game
 * actor via `BET_RESOLVED` — found via `system.get("game")` (the
 * gameActor is registered with that systemId in `app.ts`). This is
 * snapshot-safe: actor refs in context are NOT serializable, but
 * systemId lookup is.
 *
 * The bet doesn't apply effects itself — that's the interpreter's job.
 * Keeps the bet pure (no draft access, no notification side-effects)
 * and uniform with the event/prank pipeline.
 */
export const betMachine = setup({
  types: {
    context: {} as BetContext,
    input: {} as BetInput,
    events: {} as BetEvent
  }
}).createMachine({
  id: "bet",
  context: ({ input }) => ({ ...input, correctCoupon: [] }),
  initial: "placed",
  states: {
    placed: {
      on: {
        RESOLVE: {
          target: "resolved",
          actions: assign({
            correctCoupon: ({ event }) => event.correctCoupon
          })
        }
      }
    },
    resolved: {
      type: "final",
      entry: sendTo(
        ({ system }) => system.get("game"),
        ({ context, self }) => ({
          type: "BET_RESOLVED" as const,
          betId: self.id,
          effects: computePayout(context)
        })
      )
    }
  }
});

/**
 * Pure payout calculator. Input: bet + correctCoupon. Output: the
 * effect list that the parent's interpreter will apply.
 *
 * 1-1 port of the inline payout block previously in
 * `executeGameday` (and before that, `bettingResults()` in the
 * deleted `src/sagas/betting.ts`).
 */
function computePayout(ctx: BetContext): EventEffect[] {
  const correct = ctx.coupon.filter(
    (c, i) => c === ctx.correctCoupon[i]
  ).length;
  const multiplier = victories[correct];

  if (multiplier) {
    const win = Math.round(multiplier * ctx.amount);
    return [
      { type: "incrementBalance", manager: ctx.manager, amount: win },
      {
        type: "addAnnouncement",
        manager: ctx.manager,
        text: `Voitit kavioveikkauksessa __${formatAmount(win)}__ pekkaa. Rivissäsi oli __${correct}__ oikein. Panoksesi oli __${formatAmount(ctx.amount)}__ pekkaa.`
      }
    ];
  }

  return [
    {
      type: "addAnnouncement",
      manager: ctx.manager,
      text: `Et voittanut kavioveikkauksessa. Rivissäsi oli __${correct}__ oikein. Panoksesi oli __${formatAmount(ctx.amount)}__ pekkaa.`
    }
  ];
}
