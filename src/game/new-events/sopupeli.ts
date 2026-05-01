import { managerCompetesIn, managersTeamId } from "@/machines/selectors";
import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "sopupeli";

export type SopupeliData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  amount: number;
  agree?: boolean;
};

/**
 * Sopupeli — interactive. Bribe to throw the next match. Amount
 * doubles in PHL. Accept: +money, −1000 strength on next gameday.
 *
 * 1-1 port of `@/game/events/sopupeli.ts`.
 */
const sopupeli: DeclarativeEvent<SopupeliData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const competesInPHL = managerCompetesIn(manager, "phl")(ctx);
    return {
      eventId,
      manager,
      amount: competesInPHL ? 300000 : 150000,
      resolved: false
    };
  },

  options: () => ({
    agree: "Kyllä. Sopu sijaa antaa!",
    disagree: "En. Kunnia ennen lompakkoa!"
  }),

  resolve: (_ctx, data, value) => ({
    ...data,
    resolved: true,
    agree: value === "agree"
  }),

  render: (data) => {
    const lines = [
      `Nimetön soittaja lupaa siirtää joukkueenne tilille ${currency(data.amount)} jos "järjestät" joukkueesi tappion seuraavassa ottelussa. Suostutko sopupeliin?`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (data.agree) {
      lines.push(`Soittaja lupaa suorittaa transaktion välittömästi.`);
    } else {
      lines.push(`Soittaja lyö luurin korvaasi.`);
    }
    return lines;
  },

  process: (ctx, data) => {
    if (!data.agree) {
      return [];
    }
    const team = managersTeamId(data.manager)(ctx);
    const effects: EventEffect[] = [
      {
        type: "incrementBalance",
        manager: data.manager,
        amount: data.amount
      },
      {
        type: "addTeamEffect",
        team,
        effect: {
          parameter: ["strength"],
          amount: -1000,
          duration: 1
        }
      }
    ];
    return effects;
  }
};

export default sopupeli;
