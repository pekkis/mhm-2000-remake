import { managerCompetesIn, managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "pauligkahvi";

export type PauligkahviData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  amount: number;
  duration: number;
  agree?: boolean;
};

/**
 * Pauligkahvi — interactive. PHL only. Top defender demands a
 * raise. Accept: −100k pekka, −50 opponent strength for 3 rounds.
 * Decline: +50 opponent strength for 3 rounds.
 *
 * 1-1 port of `@/game/events/pauligkahvi.ts`.
 */
const pauligkahvi: DeclarativeEvent<PauligkahviData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (!managerCompetesIn(manager, "phl")(ctx)) {
      return null;
    }
    return {
      eventId,
      manager,
      amount: 100000,
      duration: 3,
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
      `Superpakillesi, Pauli G. Kahville, ei pikkuraha enää riitä. Mies vaatii ${data.amount} pekan korotusta ja edustusautoa. Suostutko?`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (data.agree) {
      lines.push(`Pauli hymyilee muikeasti.`);
    } else {
      lines.push(`Mies mutisee jotakin kapinasta poistuessaan luotasi.`);
    }
    return lines;
  },

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const strength = 50;
    const effects: EventEffect[] = [];
    if (data.agree) {
      effects.push({
        type: "decrementBalance",
        manager: data.manager,
        amount: data.amount
      });
      effects.push({
        type: "addOpponentEffect",
        team,
        effect: {
          parameter: ["strength"],
          amount: -strength,
          duration: data.duration
        }
      });
    } else {
      effects.push({
        type: "addOpponentEffect",
        team,
        effect: {
          parameter: ["strength"],
          amount: strength,
          duration: data.duration
        }
      });
    }
    return effects;
  }
};

export default pauligkahvi;
