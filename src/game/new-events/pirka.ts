import type { DeclarativeEvent } from "@/types/event";
import { currency } from "@/services/format";

const eventId = "pirka";

export type PirkaData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
};

/**
 * Pirka — gift event. The aged rocker dies and leaves the team
 * 80 000 pekka and a Pekingese. No player choice, no rolls.
 *
 * 1-1 port of the saga version in `@/game/events/pirka.ts`.
 */
const pirka: DeclarativeEvent<PirkaData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: 80000
  }),

  render: (data) => [
    `Ikääntynyt rokkitähti, __Pirka__, kuolee ja lahjoittaa koko omaisuutensa joukkueelle (${currency(data.amount)} ja kiinanpalatsikoiran).`
  ],

  // No `options` and no `resolve` — `resolved: true` at creation time.

  process: (_ctx, data) => [
    { type: "incrementBalance", manager: data.manager, amount: data.amount }
  ]
};

export default pirka;
