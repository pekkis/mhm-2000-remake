import { randomManager, randomTeamOrNullFrom } from "@/machines/selectors";
import type { Team } from "@/state/game";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "foreignLegion";

export type ForeignLegionData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  duration: number;
  team: number;
  teamName: string;
  managerName: string;
  managerName2: string;
};

/**
 * Foreign legion — pre-resolved. Strong (≥270) PHL team's locker
 * room implodes; permanent strength −60.
 *
 * 1-1 port of `@/game/events/foreign-legion.ts`.
 */
const foreignLegion: DeclarativeEvent<ForeignLegionData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamOrNullFrom(
      ["phl"],
      false,
      [],
      (t: Team) => t.strength >= 270
    )(ctx);
    if (!team) {
      return null;
    }
    const r1 = randomManager()(ctx);
    const r2 = randomManager([r1.id])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      duration: 1000,
      team: team.id,
      teamName: team.name,
      managerName: r1.name,
      managerName2: r2.name
    };
  },

  render: (data) => [
    `Liigan huippujoukkue __${data.teamName}__ on törmännyt pelaajapolitiikallaan jäävuoreen! Tähtiä vilisevä mestariehdokas on muuttunut riitaisaksi muukalaislegioonaksi, jossa kaikki vihaavat kaikkia!

Manageri __${data.managerName}__ saa lähteä. Tilalle palkataan __${data.managerName2}__, mutta tilanne ei oletettavasti muutu mihinkään...`
  ],

  process: (_ctx, data) => [
    {
      type: "addTeamEffect",
      team: data.team,
      effect: { parameter: ["strength"], amount: -60, duration: data.duration }
    }
  ]
};

export default foreignLegion;
