import type { ActorRefFrom } from "xstate";
import type { betMachine } from "@/machines/bet";
import type { championBetMachine } from "@/machines/championBet";

/**
 * Betting slice — every actor and bookkeeping value related to wagers.
 *
 * - `parlayBets`: weekly parlay (kavioveikkaus) actors. Spawned on
 *   `PLACE_BET`, parked in `placed` until the league round runs in
 *   `executeGameday`. Cleared at the round boundary by `advanceRound`.
 * - `championBets`: pre-season championship picks. Spawned on
 *   `PLACE_CHAMPION_BET`, resolved at end-of-season once the champion
 *   is decided.
 * - `lastLeagueCoupon`: transient bridge between `executeGameday` and
 *   `resolveParlayBets`. Set when a PHL phase-0 group-0 round runs;
 *   consumed (and cleared) by `resolveParlayBets`, which dispatches
 *   `RESOLVE { correctCoupon }` to each parlay bet. Avoids carrying a
 *   `let` across the gameday `produce()` boundary.
 */
export type BettingState = {
  parlayBets: ActorRefFrom<typeof betMachine>[];
  championBets: ActorRefFrom<typeof championBetMachine>[];
  lastLeagueCoupon: string[] | undefined;
};
