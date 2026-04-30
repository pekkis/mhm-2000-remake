import {
  managerCompetesIn,
  managersTeamId,
  randomManager
} from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "stalking";

export type StalkingData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  stalker: string;
};

/**
 * Stalking — pre-resolved. PHL-only. A rival manager is scouting
 * your team; fear tanks morale by a comically large 10000 (saga
 * value, not a typo).
 *
 * 1-1 port of `@/game/events/stalking.ts`.
 */
const stalking: DeclarativeEvent<StalkingData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (!managerCompetesIn(manager, "phl")(ctx)) {
      return null;
    }
    const stalker = randomManager()(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      stalker: stalker.name
    };
  },

  render: (data) => [
    `Manageri __${data.stalker}__ kyttää paikkaa joukkueessa. Mies tunnetaan tappavan raskaista harjoituksistaan ja pirullisuudestaan, joten pelko romahduttaa moraalin vaikkei jutussa olekaan perää!`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    return [{ type: "decrementMorale", team, amount: 10000 }];
  }
};

export default stalking;
