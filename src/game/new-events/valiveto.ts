import { managersArena, managersDifficulty } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "valiveto";

export type ValivetoData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  newArenaLevel: number;
};

/**
 * Väliveto Inc — pre-resolved. Mystery financier covers an arena
 * upgrade. Skipped on difficulty 4 and on level-9 arenas.
 *
 * 1-1 port of `@/game/events/valiveto.ts`.
 */
const valiveto: DeclarativeEvent<ValivetoData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const difficulty = managersDifficulty(manager)(ctx);
    if (difficulty === 4) {
      return null;
    }
    const currentArena = managersArena(manager)(ctx);
    if (!currentArena || currentArena.level === 9) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true,
      newArenaLevel: currentArena.level + 1
    };
  },

  render: () => [
    `Salaperäinen rahoitusyhtiö __Väliveto Inc.__ kustantaa hallinne laajennuksen!`
  ],

  process: (_ctx, data) => [
    { type: "setArenaLevel", manager: data.manager, level: data.newArenaLevel }
  ]
};

export default valiveto;
