import {
  managerHasService,
  managersTeamId,
  teamCompetesIn,
  teamHasActiveEffects
} from "@/machines/selectors";
import { currency as c } from "@/services/format";
import { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "kuralahti";

export type KuralahtiData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  duration: number;
  amount: number;
  hasInsurance: boolean;
};

/**
 * Kuralahti — pre-resolved. Skipped if team has active effects.
 * Sends Jallu Kuralahti to rehab for `cinteger(1,7)` rounds;
 * strength `−5 * (PHL ? 2 : 1)`. Insurance pays 5000, +60 extra.
 *
 * 1-1 port of `@/game/events/kuralahti.ts`.
 */
const kuralahti: DeclarativeEvent<KuralahtiData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = managersTeamId(manager)(ctx);
    if (teamHasActiveEffects(team)(ctx)) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true,
      duration: cinteger(1, 7),
      amount: 5000,
      hasInsurance: managerHasService(manager, "insurance")(ctx)
    };
  },

  render: (data) => {
    const t = [
      `Lähetät raikulihyökkääjä __Jallu Kuralahden__ huumevieroitukseen ${data.duration} pelin ajaksi.`
    ];
    if (data.hasInsurance) {
      t.push(`Vakuutusyhtiö maksaa sinulle ${c(data.amount)}.`);
    }
    return t;
  },

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const multiplier = teamCompetesIn(team, "phl")(ctx) ? 2 : 1;
    const strengthLoss = multiplier * -5;
    const effects: EventEffect[] = [
      {
        type: "addTeamEffect",
        team,
        effect: {
          parameter: ["strength"],
          amount: strengthLoss,
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
        amount: 60
      });
    }
    return effects;
  }
};

export default kuralahti;
