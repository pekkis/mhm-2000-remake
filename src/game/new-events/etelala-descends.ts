import { managerHasService } from "@/machines/selectors";
import random, { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "etelalaDescends";

export type EtelalaDescendsData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
  hasInsurance: boolean;
};

/**
 * Etelälä descends — pre-resolved. Insurance base price drops by
 * `cinteger(0,100) + 50` (delta is negative).
 *
 * 1-1 port of `@/game/events/etelala-descends.ts`.
 */
const etelalaDescends: DeclarativeEvent<EtelalaDescendsData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: -(cinteger(0, 100) + 50),
    hasInsurance: managerHasService(manager, "insurance")(ctx)
  }),

  render: (data) => {
    const t = [`Etelälä laskee vakuutuksensa lähtöhintoja!`];
    if (data.hasInsurance) {
      t.push(`Johtokunta kiittelee yhtiön päätöstä!`);
    }
    return t;
  },

  process: (_ctx, data) => [
    {
      type: "incrementServiceBasePrice",
      service: "insurance",
      amount: data.amount
    }
  ]
};

export default etelalaDescends;
