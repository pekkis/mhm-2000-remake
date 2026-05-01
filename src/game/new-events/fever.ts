import { managerHasService, managersTeam } from "@/machines/selectors";
import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "fever";

export type FeverData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
  hasInsurance: boolean;
};

/**
 * Fever — pre-resolved. Half the team in bed; strength −50%,
 * morale −6 for one round. Insurance pays 10 000 pekka, +90 extra.
 *
 * 1-1 port of `@/game/events/fever.ts`.
 */
const fever: DeclarativeEvent<FeverData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: 10000,
    hasInsurance: managerHasService(manager, "insurance")(ctx)
  }),

  render: (data) => {
    const t = [
      `Omituinen kuumetauti iskee joukkueeseen. Puolet pelaajista makaa petissä seuraavan ottelun ajan!`
    ];
    if (data.hasInsurance) {
      t.push(`Etelälä korvaa ${currency(data.amount)}.`);
    }
    return t;
  },

  process: (ctx, data) => {
    const team = managersTeam(data.manager)(ctx);
    const effects: EventEffect[] = [
      {
        type: "addTeamEffect",
        team: team.id,
        effect: {
          parameter: ["strength"],
          amount: -Math.round(team.strength * 0.5),
          duration: 1
        }
      },
      {
        type: "addTeamEffect",
        team: team.id,
        effect: { parameter: ["morale"], amount: -6, duration: 1 }
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

export default fever;
