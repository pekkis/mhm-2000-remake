import { managersDifficulty } from "@/machines/selectors";
import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "fanMerchandise";

type SalesKind = "good" | "bad";

export type FanMerchandiseData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
  sales: SalesKind;
};

/**
 * Fan merchandise — pre-resolved. ±40 000 pekka. Negative on
 * difficulty 4, positive otherwise.
 *
 * 1-1 port of `@/game/events/fan-merchandise.ts`.
 */
const fanMerchandise: DeclarativeEvent<FanMerchandiseData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: 40000,
    sales: managersDifficulty(manager)(ctx) === 4 ? "bad" : "good"
  }),

  render: (data) =>
    data.sales === "good"
      ? [
          `Fanituotteet myyvät __todella hyvin__! Viime kuukauden voitto ${currency(data.amount)}.`
        ]
      : [
          `Fanituotteet myyvät __todella huonosti__! Viime kuukauden tappio ${currency(data.amount)}.`
        ],

  process: (_ctx, data) => [
    data.sales === "good"
      ? {
          type: "incrementBalance",
          manager: data.manager,
          amount: data.amount
        }
      : {
          type: "decrementBalance",
          manager: data.manager,
          amount: data.amount
        }
  ]
};

export default fanMerchandise;
