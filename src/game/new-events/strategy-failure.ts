import { managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "strategyFailure";

export type StrategyFailureData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
};

/**
 * Strategy failure — pre-resolved. Players burn out: readiness −3.
 *
 * 1-1 port of `@/game/events/strategy-failure.ts`.
 */
const strategyFailure: DeclarativeEvent<StrategyFailureData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true
  }),

  render: () => [
    `Pelaajasi väsyvät kovaa vauhtia! Heidän kuntopohjansa ei yksinkertaisesti ole kestänyt kiivasta ottelurytmiä.`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    return [{ type: "incrementReadiness", team, amount: -3 }];
  }
};

export default strategyFailure;
