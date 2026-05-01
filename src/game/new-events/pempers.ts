import { managersTeamId } from "@/machines/selectors";
import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "pempers";

export type PempersData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
  moraleLost: number;
};

/**
 * Pempers — pre-resolved. Diaper-ad gig pays 55 000 but morale −3.
 *
 * 1-1 port of `@/game/events/pempers.ts`.
 */
const pempers: DeclarativeEvent<PempersData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    amount: 55000,
    moraleLost: 3
  }),

  render: (data) => [
    `Mainostoimisto maksaa ${currency(data.amount)} joukkueen esiintymisestä vaippamainoksessa. Ihmiset nauravat, ja moraali laskee!`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    return [
      { type: "incrementBalance", manager: data.manager, amount: data.amount },
      { type: "decrementMorale", team, amount: data.moraleLost }
    ];
  }
};

export default pempers;
