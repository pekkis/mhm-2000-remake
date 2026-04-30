import { managersTeamId } from "@/machines/selectors";
import { amount as a } from "@/services/format";
import r from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "limpenius";

export type LimpeniusData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
  moraleChange: number;
  success: boolean;
};

/**
 * Limpenius — pre-resolved. Ilta-Maso libel suit; 60% chance you
 * win (gain 60 000 + morale +4), else lose (−60 000, morale −4).
 *
 * 1-1 port of `@/game/events/limpenius.ts`.
 */
const limpenius: DeclarativeEvent<LimpeniusData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: 60000,
    moraleChange: 4,
    success: r.bool(0.6)
  }),

  render: (data) => {
    const t = [
      `Ilta-Maso kirjoittaa häväistysjutun sinusta ja __Landa Limpeniuksesta__. Haastat Ilta-Mason oikeuteen!`
    ];
    if (data.success) {
      t.push(
        `Voitat jutun ja Ilta-Maso maksaa sinulle ${a(data.amount)} pekkaa. Lisäksi moraali nousee maineesi puhdistuessa!`
      );
    } else {
      t.push(
        `Ilta-Maso voittaa jutun ja maksat kulut, ${a(data.amount)} pekkaa. Lisäksi moraali laskee maineesi murentuessa!`
      );
    }
    return t;
  },

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const effects: EventEffect[] = data.success
      ? [
          {
            type: "incrementBalance",
            manager: data.manager,
            amount: data.amount
          },
          { type: "incrementMorale", team, amount: data.moraleChange }
        ]
      : [
          {
            type: "decrementBalance",
            manager: data.manager,
            amount: data.amount
          },
          { type: "incrementMorale", team, amount: -data.moraleChange }
        ];
    return effects;
  }
};

export default limpenius;
