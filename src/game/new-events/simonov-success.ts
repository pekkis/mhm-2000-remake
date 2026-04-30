import { managersTeam, managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "simonovSuccess";

export type SimonovSuccessData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
};

/**
 * Simonov success — pre-resolved. Only fires when the manager's team
 * is on strategy `0` (Juri Simonov, peaked-for-playoffs). Readiness +6.
 *
 * 1-1 port of `@/game/events/simonov-success.ts`.
 */
const simonovSuccess: DeclarativeEvent<SimonovSuccessData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = managersTeam(manager)(ctx);
    if (!team || team.strategy !== 0) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true
    };
  },

  render: () => [
    `Pelaajasi ovat edellä suunniteltua aikataulua. Vaikka "Juri Simonov"-strategian ansiosta  kuntohuippunne onkin ajoitettu play-offeihin, pelaavat "pojat" jo nyt kuin huomista ei olisi. Sinulla on hyvä syy odottaa tilanteen ainoastaan paranevan kohti kevättä!`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    return [{ type: "incrementReadiness", team, amount: 6 }];
  }
};

export default simonovSuccess;
