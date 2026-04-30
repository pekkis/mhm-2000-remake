import { managersTeamId, randomManager } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "bestManagerEver";

export type BestManagerEverData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  otherManager: string;
};

/**
 * Best manager ever — pre-resolved. Ilta-Maso ranks the manager #1.
 * Morale +1.
 *
 * 1-1 port of `@/game/events/best-manager-ever.ts`.
 */
const bestManagerEver: DeclarativeEvent<BestManagerEverData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const r = randomManager()(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      otherManager: r.name
    };
  },

  render: (data) => [
    `__Ilta-Maso__ rankkaa sinut _kaikkien aikojen parhaaksi_ manageriksi! Listan hänniltä löytyy ${data.otherManager}.`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    return [{ type: "incrementMorale", team, amount: 1 }];
  }
};

export default bestManagerEver;
