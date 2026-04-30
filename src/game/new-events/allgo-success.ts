import { managersTeam, managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "allgoSuccess";

export type AllgoSuccessData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
};

/**
 * Allgo success — pre-resolved. Fires when team is on strategy `1`
 * (all-in / kaikki peliin). Readiness +6.
 *
 * 1-1 port of `@/game/events/allgo-success.ts`.
 */
const allgoSuccess: DeclarativeEvent<AllgoSuccessData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = managersTeam(manager)(ctx);
    if (!team || team.strategy !== 1) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true
    };
  },

  render: () => [
    `Pelaajiesi kunto on osoittautunut odotettuakin paremmaksi! Kuluttavasta "kaikki peliin"-strategiastanne huolimatta "pojat" jaksavat yhä treenata entistäkin kovemmin, ja tämä näkyy toivottavasti peliesityksissä pitkälle kevääseen!`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    return [{ type: "incrementReadiness", team, amount: 6 }];
  }
};

export default allgoSuccess;
