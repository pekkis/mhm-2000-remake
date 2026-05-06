import { managerHasService } from "@/machines/selectors";
import { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "etelalaAscends";

export type EtelalaAscendsData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
  hasInsurance: boolean;
};

/**
 * Etelälä ascends — pre-resolved. Insurance base price hikes by
 * `cinteger(0,100) + 50`.
 *
 * 1-1 port of `@/game/events/etelala-ascends.ts`.
 */
const etelalaAscends: DeclarativeEvent<EtelalaAscendsData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: cinteger(0, 100) + 50,
    hasInsurance: managerHasService(manager, "insurance")(ctx)
  }),

  render: (data) => {
    const t = [`Etelälä nostaa vakuutuksensa lähtöhintoja!`];
    if (data.hasInsurance) {
      t.push(`Johtokunta lähettää yhtiölle vihaisen nootin!`);
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

export default etelalaAscends;
