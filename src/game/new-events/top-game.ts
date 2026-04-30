import type { DeclarativeEvent } from "@/types/event";

const eventId = "topGame";

export type TopGameData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
};

/**
 * Top game — pre-resolved. Recent match aired on national TV; league
 * pays a flat 20 000.
 *
 * 1-1 port of `@/game/events/top-game.ts`.
 */
const topGame: DeclarativeEvent<TopGameData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: 20000
  }),

  render: (data) => [
    `__Maso TV:llä__ on sopimus liigan kanssa otteluiden näyttämisestä. Luonnollisesti huippuottelut kiinnostavat, ja joukkueesi äskeinen ottelu näkyikin valtakunnanverkossa. Liiga maksaa teille ${data.amount} pekkaa.`
  ],

  process: (_ctx, data) => [
    { type: "incrementBalance", manager: data.manager, amount: data.amount }
  ]
};

export default topGame;
