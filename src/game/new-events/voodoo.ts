import { managersTeamId } from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "voodoo";

export type VoodooData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  amount: number;
  agree?: boolean;
};

/**
 * Voodoo — interactive. Mysterious man offers to double team
 * strength for 100k. Accept: +10000 morale, −100k. Decline: −1
 * morale (curse).
 *
 * 1-1 port of `@/game/events/voodoo.ts`.
 */
const voodoo: DeclarativeEvent<VoodooData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    amount: 100000,
    resolved: false
  }),

  options: () => ({
    agree: `Totta kai. Tervetuloa harjoituksiimme, hyvä herra, tässä rahat!`,
    disagree: "En maksa. Kiitos tarjouksesta, ehkä joku toinen kerta!"
  }),

  resolve: (_ctx, data, value) => ({
    ...data,
    resolved: true,
    agree: value === "agree"
  }),

  render: (data) => {
    const lines = [
      `Haitilta saapunut tumma mies lupaa tuplata joukkueesi voiman ${a(data.amount)} pekalla. Maksatko?`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (data.agree) {
      lines.push(`Yhteishenki paranee kun pelaajat uskovat itseensä enemmän!!`);
    } else {
      lines.push(`Mies vilauttaa sinulle voodoo-nukkeaan...`);
    }
    return lines;
  },

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const effects: EventEffect[] = [];
    if (data.agree) {
      effects.push({ type: "incrementMorale", team, amount: 10000 });
      effects.push({
        type: "decrementBalance",
        manager: data.manager,
        amount: data.amount
      });
    } else {
      effects.push({ type: "decrementMorale", team, amount: 1 });
    }
    return effects;
  }
};

export default voodoo;
