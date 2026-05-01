import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "masotv";

export type MasotvData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
};

/**
 * Masotv — pre-resolved. Maso TV buys broadcast rights to the next
 * game for a flat 30 000.
 *
 * 1-1 port of `@/game/events/masotv.ts`.
 */
const masotv: DeclarativeEvent<MasotvData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: 30000
  }),

  render: (data) => [
    `__Maso TV__ ostaa seuraavan ottelunne televisiointioikeudet. He maksavat joukkueelle ${currency(data.amount)}.`
  ],

  process: (_ctx, data) => [
    { type: "incrementBalance", manager: data.manager, amount: data.amount }
  ]
};

export default masotv;
