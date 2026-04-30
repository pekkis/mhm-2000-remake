import { managerHasService, managersTeam } from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "hasselgren";

export type HasselgrenData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
  hasInsurance: boolean;
};

/**
 * Hasselgren — pre-resolved. Hasselgren beats up an opponent. 5
 * round strength −10, morale −5, 40 000 pekka fine (insurance
 * covers, +90 extra).
 *
 * 1-1 port of `@/game/events/hasselgren.ts`.
 */
const hasselgren: DeclarativeEvent<HasselgrenData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: 40000,
    hasInsurance: managerHasService(manager, "insurance")(ctx)
  }),

  render: (data) => {
    const t = [
      `Pelaaja __Thomas Hasselgren__ hakkasi edellisessä ottelussa erään pelaajan henkihieveriin! Hän saa 5 ottelun pelikiellon, ja muiden pelaajien moraali laskee! Lisäksi joukkueesi tuomitaan ${a(data.amount)} pekan sakkoihin!`
    ];
    if (data.hasInsurance) {
      t.push(`Etelälä maksaa sakot!`);
    }
    return t;
  },

  process: (ctx, data) => {
    const team = managersTeam(data.manager)(ctx);
    const effects: EventEffect[] = [
      {
        type: "addTeamEffect",
        team: team.id,
        effect: { parameter: ["strength"], amount: -10, duration: 5 }
      },
      { type: "incrementMorale", team: team.id, amount: -5 }
    ];
    if (data.hasInsurance) {
      effects.push({
        type: "incrementInsuranceExtra",
        manager: data.manager,
        amount: 90
      });
    } else {
      effects.push({
        type: "decrementBalance",
        manager: data.manager,
        amount: data.amount
      });
    }
    return effects;
  }
};

export default hasselgren;
