import { managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "strategySuccess";

export type StrategySuccessData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
};

/**
 * Strategy success — pre-resolved. Mystery readiness boost: +3.
 *
 * 1-1 port of `@/game/events/strategy-success.ts`.
 */
const strategySuccess: DeclarativeEvent<StrategySuccessData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true
  }),

  render: () => [
    `Pelaajiesi kunto kohenee jostain syystä silmissä! Kiekko liikkuu kovalla sykkeellä treeneissä ja peliesityksetkin kohenevat.`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    return [{ type: "incrementReadiness", team, amount: 3 }];
  }
};

export default strategySuccess;
