import {
  managerCompetesIn,
  managerHasService,
  managersTeamId
} from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "laskisalonen";

export type LaskisalonenData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  strength: number;
  duration: number;
  hasInsurance: boolean;
  amount: number;
};

/**
 * Läski-Salonen — pre-resolved. Both goalies hurt; chub fills in.
 * Opponent strength −150 (PHL) / −75 (div) for one round.
 * Insurance pays 35 000, +90 extra.
 *
 * 1-1 port of `@/game/events/laskisalonen.ts`.
 */
const laskisalonen: DeclarativeEvent<LaskisalonenData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    strength: managerCompetesIn(manager, "phl")(ctx) ? -150 : -75,
    duration: 1,
    hasInsurance: managerHasService(manager, "insurance")(ctx),
    amount: 35000
  }),

  render: (data) => {
    const t = [
      `Molemmat maalivahtinne ovat loukkaantuneet! Ainoa halukas tuuraaja on 300-kiloinen __Läski-Salonen__, joka kaikeksi onneksi tukkii maalin _tosi tehokkaasti_, mutta valitettavasti vain ${data.duration} ottelun ajan!`
    ];
    if (data.hasInsurance) {
      t.push(
        `Etelälä on velvollinen maksamaan korvauksina ${a(data.amount)} pekkaa!`
      );
    }
    return t;
  },

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const effects: EventEffect[] = [
      {
        type: "addOpponentEffect",
        team,
        effect: {
          parameter: ["strength"],
          amount: data.strength,
          duration: data.duration
        }
      }
    ];
    if (data.hasInsurance) {
      effects.push({
        type: "incrementBalance",
        manager: data.manager,
        amount: data.amount
      });
      effects.push({
        type: "incrementInsuranceExtra",
        manager: data.manager,
        amount: 90
      });
    }
    return effects;
  }
};

export default laskisalonen;
