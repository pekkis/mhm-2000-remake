import { managerHasService, managersArena } from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "etelalaBonusFrenzy";

export type EtelalaBonusFrenzyData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
  hasInsurance: boolean;
};

/**
 * Etelälä bonus frenzy — pre-resolved. Insurance bonus drops by
 * `30 * (arena.level + 1)` (negative delta on `insuranceExtra`).
 *
 * 1-1 port of `@/game/events/etelala-bonusfrenzy.ts`.
 */
const etelalaBonusFrenzy: DeclarativeEvent<EtelalaBonusFrenzyData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const arena = managersArena(manager)(ctx);
    if (!arena) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true,
      amount: -(30 * (arena.level + 1)),
      hasInsurance: managerHasService(manager, "insurance")(ctx)
    };
  },

  render: (data) => {
    const t = [`Etelälä julkistaa suuren kansainvälisen __bonustempauksen__!`];
    if (data.hasInsurance) {
      t.push(
        `Vakuutussummasi laskee ${a(Math.abs(data.amount))} pekan verran!`
      );
    }
    return t;
  },

  process: (_ctx, data) => [
    {
      type: "incrementInsuranceExtra",
      manager: data.manager,
      amount: data.amount
    }
  ]
};

export default etelalaBonusFrenzy;
