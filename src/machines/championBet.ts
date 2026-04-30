import { setup, sendTo, assign } from "xstate";

import type { EventEffect } from "@/game/event-effects";
import { amount as formatAmount } from "@/services/format";

export type ChampionBetInput = {
  manager: string;
  team: number;
  amount: number;
  odds: number;
};

type ChampionBetContext = ChampionBetInput & {
  champion: number | undefined;
};

export type ChampionBetEvent = { type: "RESOLVE"; champion: number };

/**
 * One championship bet. Spawned by `gameMachine` on `PLACE_CHAMPION_BET`,
 * parked in `placed` until end-of-season (when the champion is decided).
 * The parent sends `RESOLVE { champion }`; the bet computes its payout
 * as `EventEffect[]` and forwards it to the game actor via
 * `BET_RESOLVED` — found via `system.get("game")` (registered with that
 * systemId in `app.ts`). Snapshot-safe via systemId lookup, same
 * pattern as `betMachine`.
 *
 * Payout: if the bet's team is the champion, win = `amount * odds`,
 * announced as a victory. The legacy saga didn't announce losses, so
 * neither do we — losing bets resolve to an empty effect list.
 */
export const championBetMachine = setup({
  types: {
    context: {} as ChampionBetContext,
    input: {} as ChampionBetInput,
    events: {} as ChampionBetEvent
  }
}).createMachine({
  id: "championBet",
  context: ({ input }) => ({ ...input, champion: undefined }),
  initial: "placed",
  states: {
    placed: {
      on: {
        RESOLVE: {
          target: "resolved",
          actions: assign({
            champion: ({ event }) => event.champion
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
 * Pure payout calculator. 1-1 port of the inline payout block from the
 * deleted `processChampionBets()` saga in `src/sagas/betting.ts`.
 */
function computePayout(ctx: ChampionBetContext): EventEffect[] {
  if (ctx.team !== ctx.champion) {
    return [];
  }

  const win = Math.round(ctx.amount * ctx.odds);
  return [
    { type: "incrementBalance", manager: ctx.manager, amount: win },
    {
      type: "addAnnouncement",
      manager: ctx.manager,
      text: `Voitit __${formatAmount(win)}__ pekkaa mestariveikkauksessa. Hyvin veikattu!`
    }
  ];
}
