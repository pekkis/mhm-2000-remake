import { managersTeamId, randomManager } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "worstManagerEver";

export type WorstManagerEverData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  otherManager: string;
};

/**
 * Worst manager ever — pre-resolved. Ilta-Pekkis ranks you bottom
 * of the league; team morale −1.
 *
 * 1-1 port of `@/game/events/worst-manager-ever.ts`.
 */
const worstManagerEver: DeclarativeEvent<WorstManagerEverData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    otherManager: randomManager()(ctx).name
  }),

  render: (data) => [
    `__Ilta-Pekkis__ rankkaa sinut _kaikkien aikojen huonoimmaksi_ manageriksi! Listan kärjestä löytyy ${data.otherManager}.`
  ],

  process: (ctx, data) => [
    {
      type: "incrementMorale",
      team: managersTeamId(data.manager)(ctx),
      amount: -1
    }
  ]
};

export default worstManagerEver;
