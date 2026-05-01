import { managersArena } from "@/machines/selectors";
import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "otsohalli";

export type OtsohalliData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  amount: number;
  agree?: boolean;
};

/**
 * Otso-Halli — interactive sponsorship. Brewery wants to rename
 * your arena. Skipped if arena is already Mauto Areena or
 * Otso-Halli. Accept: +800k pekka, arena renamed.
 *
 * 1-1 port of `@/game/events/otsohalli.ts`.
 */
const otsohalli: DeclarativeEvent<OtsohalliData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const arena = managersArena(manager)(ctx);
    if (!arena || ["Mauto Areena", "Otso-Halli"].includes(arena.name)) {
      return null;
    }
    return { eventId, manager, amount: 800000, resolved: false };
  },

  options: () => ({
    agree: "Kyllä. Olutraha kelpaa aina!",
    disagree: "Ei. Onpa kerrassaan moraaliton ehdotus!"
  }),

  resolve: (_ctx, data, value) => ({
    ...data,
    resolved: true,
    agree: value === "agree"
  }),

  render: (data) => {
    const lines = [
      `Suuri olutpanimo on halukas sponsoroimaan joukkuettasi! Se maksaa ${currency(data.amount)}, jos hallin nimi muutetaan __Otso-Halliksi__. Otatko tarjouksen vastaan?"`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (data.agree) {
      lines.push(`Sponsoritarroja liimaillaan hallilla jo tätä lukiessasi.`);
    } else {
      lines.push(
        `Panimon edustaja on selvästi kummissaan, mutta ei voi kuin hyväksyä päätöksesi.`
      );
    }
    return lines;
  },

  process: (_ctx, data) => {
    if (!data.agree) {
      return [];
    }
    const effects: EventEffect[] = [
      {
        type: "incrementBalance",
        manager: data.manager,
        amount: data.amount
      },
      { type: "renameArena", manager: data.manager, name: "Otso-Halli" }
    ];
    return effects;
  }
};

export default otsohalli;
