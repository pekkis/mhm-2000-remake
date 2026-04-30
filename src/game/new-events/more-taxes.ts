import { managerCompetesIn, managersDifficulty } from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "moreTaxes";

export type MoreTaxesData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
};

const getAmount = (competesInPHL: boolean, difficulty: number): number => {
  const base = competesInPHL ? 100000 : 50000;
  if (difficulty <= 1) {
    return base;
  }
  if (difficulty <= 3) {
    return base + 40000;
  }
  return base - 20000;
};

/**
 * More taxes — pre-resolved. Tax bear bites your wallet. Amount
 * scales with division (PHL/division) and difficulty.
 *
 * 1-1 port of `@/game/events/more-taxes.ts`.
 */
const moreTaxes: DeclarativeEvent<MoreTaxesData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: getAmount(
      managerCompetesIn(manager, "phl")(ctx),
      managersDifficulty(manager)(ctx)
    )
  }),

  render: (data) => [
    `Aaaaargh! Verokarhu päättää mätkäistä ${a(data.amount)} pekan lisäveron joukkueellesi!`
  ],

  process: (_ctx, data) => [
    { type: "decrementBalance", manager: data.manager, amount: data.amount }
  ]
};

export default moreTaxes;
