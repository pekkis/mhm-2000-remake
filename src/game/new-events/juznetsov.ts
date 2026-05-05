import {
  managerCompetesIn,
  managerHasService,
  managersTeamId
} from "@/machines/selectors";
import random, { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";
import { currency } from "@/services/format";

const eventId = "juznetsov";

export type JuznetsovData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  effect: number;
  amount: number;
  duration: number;
  hasInsurance: boolean;
};

/**
 * Juznetsov — pre-resolved. Russian D-man stuns himself; 5-round
 * opponent strength buff (+20 PHL / +10 div). Insurance pays 7000,
 * +50 extra.
 *
 * 1-1 port of `@/game/events/juznetsov.ts`.
 */
const juznetsov: DeclarativeEvent<JuznetsovData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    effect: managerCompetesIn(manager, "phl")(ctx) ? 20 : 10,
    amount: 7000,
    duration: cinteger(0, 3) + 2,
    hasInsurance: managerHasService(manager, "insurance")(ctx)
  }),

  render: (data) => {
    const t = [
      `Auts! Venäläispakki Kuri Juznetsov törmää harjoituksissa pää edellä laitaan ja on seuraavat ${data.duration} ottelua pyörällä päästään!`
    ];
    if (data.hasInsurance) {
      t.push(`Etelälä joutuu maksamaan ${currency(data.amount)}!`);
    }
    return t;
  },

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const effects: EventEffect[] = [
      {
        type: "addOpponentEffect",
        team,
        effect: { parameter: ["strength"], amount: data.effect, duration: 5 }
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
        amount: 50
      });
    }
    return effects;
  }
};

export default juznetsov;
