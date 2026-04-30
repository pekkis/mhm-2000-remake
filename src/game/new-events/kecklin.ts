import { managersTeamId } from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "kecklin";

export type KecklinData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  amount: number;
  duration: number;
  agree?: boolean;
};

/**
 * Kecklin — interactive. Star goalie demands a raise.
 * Accept: −150k pekka, −65 opponent strength for 1 round.
 * Decline: +65 opponent strength for 1 round.
 *
 * 1-1 port of `@/game/events/kecklin.ts`.
 */
const kecklin: DeclarativeEvent<KecklinData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    amount: 150000,
    duration: 3,
    resolved: false
  }),

  options: () => ({
    agree: "Suostun, mutta vain pakon edessä.",
    disagree: "Ei tule kuulonkaan."
  }),

  resolve: (_ctx, data, value) => ({
    ...data,
    resolved: true,
    agree: value === "agree"
  }),

  render: (data) => {
    const lines = [
      `Ykkösmaalivahtinne Limmo Kecklin haluaa ${a(data.amount)} pekan palkankorotuksen. Suostutko?`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (!data.agree) {
      lines.push(
        `Kecklin kohauttaa olkapäitään. "No, aina kannattaa yrittää."`
      );
    } else {
      lines.push(`Kecklin on oikein tyytyväinen itseensä poistuessaan.`);
    }
    return lines;
  },

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const strength = data.agree ? -65 : 65;
    const effects: EventEffect[] = [];
    if (data.agree) {
      effects.push({
        type: "decrementBalance",
        manager: data.manager,
        amount: data.amount
      });
    }
    effects.push({
      type: "addOpponentEffect",
      team,
      effect: {
        parameter: ["strength"],
        amount: strength,
        duration: 1
      }
    });
    return effects;
  }
};

export default kecklin;
