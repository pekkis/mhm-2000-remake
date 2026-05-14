import type { ActorRefFrom } from "xstate";
import type { betMachine } from "@/machines/bet";

/**
 * Betting slice — every actor and bookkeeping value related to wagers.
 *
 * - `parlayBets`: weekly parlay (kavioveikkaus) actors. Spawned on
 *   `PLACE_BET`, parked in `placed` until the league round runs in
 *   `executeGameday`. Cleared at the round boundary by `advanceRound`.
 * - `lastLeagueCoupon`: transient bridge between `executeGameday` and
 *   `resolveParlayBets`. Set when a PHL phase-0 group-0 round runs;
 *   consumed (and cleared) by `resolveParlayBets`, which dispatches
 *   `RESOLVE { correctCoupon }` to each parlay bet. Avoids carrying a
 *   `let` across the gameday `produce()` boundary.
 */
export type BettingState = {
  parlayBets: ActorRefFrom<typeof betMachine>[];
  lastLeagueCoupon: string[] | undefined;
};
