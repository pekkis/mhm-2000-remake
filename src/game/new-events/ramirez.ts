import { managerHasService } from "@/machines/selectors";
import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "ramirez";

export type RamirezData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  hasInsurance: boolean;
  amount: number;
};

/**
 * Ramirez — pre-resolved. Spanish import busts his nose; you owe
 * 90 000 pekka unless insured (Etelälä covers it; insurance extra
 * +50).
 *
 * 1-1 port of `@/game/events/ramirez.ts`.
 */
const ramirez: DeclarativeEvent<RamirezData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    hasInsurance: managerHasService(manager, "insurance")(ctx),
    amount: 90000
  }),

  render: (data) => {
    const t = [
      `Espanjalaisvahvistuksesi __Jorge Ramirez__, liigan komeimmaksi ja egoistisimmaksi mainittu pelaaja, kompastuu harjoituksissa kaatuen ja murtaen kuuluisan kyömynenänsä! Sopimuksen erikoispykälä velvoittaa sinut maksamaan plastiikkakirurgikulut, ${currency(data.amount)}!`
    ];
    if (data.hasInsurance) {
      t.push(`Etelälä maksaa viulut!`);
    }
    return t;
  },

  process: (_ctx, data) =>
    data.hasInsurance
      ? [
          {
            type: "incrementInsuranceExtra",
            manager: data.manager,
            amount: 50
          }
        ]
      : [
          {
            type: "decrementBalance",
            manager: data.manager,
            amount: data.amount
          }
        ]
};

export default ramirez;
