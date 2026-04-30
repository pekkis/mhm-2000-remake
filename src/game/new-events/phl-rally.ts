import difficultyLevels from "@/data/difficulty-levels";
import {
  managerCompetesIn,
  managerFlag,
  managersDifficulty,
  managersTeamId
} from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "phlRally";

export type PhlRallyData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  difficulty: number;
};

/**
 * PHL rally — pre-resolved. Skipped unless you compete in PHL and
 * the `rally` flag is unset. Mirror of `divisionRally` for PHL.
 *
 * 1-1 port of `@/game/events/phl-rally.ts`.
 */
const phlRally: DeclarativeEvent<PhlRallyData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (!managerCompetesIn(manager, "phl")(ctx)) {
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
    `Uusi ohjelmanjulistuksesi "KULTA ON VÄRIMME" saa aikaan todellisen jääkiekkobuumin! Kansa ryntää hallille ja taistelu mestaruudesta on todella alkanut`
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
        extra: dl.rallyExtra("phl")
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

export default phlRally;
