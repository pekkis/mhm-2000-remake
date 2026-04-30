import { managersDifficulty, managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "pstudio";

export type PstudioData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  moraleLoss: number;
};

/**
 * P-Studio — pre-resolved. Fake tax-evasion exposé tanks morale.
 * Loss scales with difficulty: `2 + difficulty`.
 *
 * 1-1 port of `@/game/events/pstudio.ts`.
 */
const pstudio: DeclarativeEvent<PstudioData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const difficulty = managersDifficulty(manager)(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      moraleLoss: 2 + difficulty
    };
  },

  render: () => [
    `__P-Studio__ tekee reportaasin joukkueenne verorästien takia. Juttu on valetta, mutta se laskee moraalia kun pelaajat pelkäävät palkanmaksun viivästymistä.`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    return [{ type: "decrementMorale", team, amount: data.moraleLoss }];
  }
};

export default pstudio;
