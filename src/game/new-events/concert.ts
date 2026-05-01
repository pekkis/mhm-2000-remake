import { managersArena } from "@/machines/selectors";
import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "concert";

export type ConcertData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
};

/**
 * Concert — pre-resolved. Big rock concert at the manager's arena;
 * payout scales with arena level: `10000 + 20000 * (level + 1)`.
 *
 * 1-1 port of `@/game/events/concert.ts`.
 */
const concert: DeclarativeEvent<ConcertData> = {
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
      amount: 10000 + 20000 * (arena.level + 1)
    };
  },

  render: (data) => [
    `Joukkueesi areenalla pidetään suuri rock-konsertti. Tuotto: ${currency(data.amount)}.`
  ],

  process: (_ctx, data) => [
    { type: "incrementBalance", manager: data.manager, amount: data.amount }
  ]
};

export default concert;
