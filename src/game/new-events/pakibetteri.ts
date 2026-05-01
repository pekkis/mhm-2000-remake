import { managerCompetesIn, managersTeamId } from "@/machines/selectors";
import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "pakibetteri";

export type PakibetteriData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  amount: number;
  duration: number;
  agree?: boolean;
};

/**
 * Pakibetteri — interactive. PHL only. NHL scout proposes lending
 * Paki-Betteri Erg for 6 rounds. Accept: +150k pekka, −25 opponent
 * strength for 6 rounds.
 *
 * 1-1 port of `@/game/events/pakibetteri.ts`.
 */
const pakibetteri: DeclarativeEvent<PakibetteriData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (!managerCompetesIn(manager, "phl")(ctx)) {
      return null;
    }
    return {
      eventId,
      manager,
      amount: 150000,
      duration: 6,
      resolved: false
    };
  },

  options: () => ({
    agree: "Suostun.",
    disagree: "En suostu."
  }),

  resolve: (_ctx, data, value) => ({
    ...data,
    resolved: true,
    agree: value === "agree"
  }),

  render: (data) => {
    const lines = [
      `NHL-seura Florida Panthersin kykyjenetsijä ehdottaa: eestiläinen pakki Paki-Betteri Erg kiinnostaa heitä, mutta he haluavat ensin nähdä hänen taitonsa. Suostutko ottamaan Ergin joukkueeseen, kun Panthers maksaisi joukkueellenne ${data.duration} ottelun koeajasta ${currency(data.amount)}?`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (!data.agree) {
      lines.push(`Paki-Betteri ei liity joukkueeseen.`);
    } else {
      lines.push(
        `Paki-Betteri liittyy joukkueeseen. Hänhän tuntuisi olevan oikein jykevä peruspuolustaja!`
      );
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
        type: "addOpponentEffect",
        team,
        effect: {
          parameter: ["strength"],
          amount: -25,
          duration: data.duration
        }
      }
    ];
    return effects;
  }
};

export default pakibetteri;
