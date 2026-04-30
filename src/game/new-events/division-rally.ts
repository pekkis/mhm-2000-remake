import difficultyLevels from "@/data/difficulty-levels";
import {
  managerCompetesIn,
  managerFlag,
  managersDifficulty,
  managersTeamId
} from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "divisionRally";

export type DivisionRallyData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  difficulty: number;
};

/**
 * Division rally — pre-resolved. Skipped unless you compete in
 * division and the `rally` manager flag is unset. Sets manager
 * extra to `difficultyLevels[diff].rallyExtra("division")` and
 * adds a permanent `"rally"` morale effect.
 *
 * 1-1 port of `@/game/events/division-rally.ts`. Difficulty
 * snapshotted in create so `process` is deterministic on replay.
 */
const divisionRally: DeclarativeEvent<DivisionRallyData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (!managerCompetesIn(manager, "division")(ctx)) {
      return null;
    }
    if (managerFlag(manager, "rally")(ctx)) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true,
      difficulty: managersDifficulty(manager)(ctx)
    };
  },

  render: () => [
    `Olet onnistunut luomaan käsittämättömän yhteishengen, ja joukkue on valmis taistelemaan tiensä liigaan!!!`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const dl = difficultyLevels[data.difficulty];
    return [
      {
        type: "setManagerFlag",
        manager: data.manager,
        flag: "rally",
        value: true
      },
      {
        type: "setExtra",
        manager: data.manager,
        extra: dl.rallyExtra("division")
      },
      {
        type: "addTeamEffect",
        team,
        effect: {
          parameter: ["morale"],
          amount: "rally",
          duration: 1000,
          extra: { rallyMorale: dl.rallyMorale }
        }
      }
    ];
  }
};

export default divisionRally;
