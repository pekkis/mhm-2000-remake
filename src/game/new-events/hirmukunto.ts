import {
  randomManager,
  randomTeamFrom,
  teamsStrength
} from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "hirmukunto";

export type HirmukuntoData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  duration: number;
  team: number;
  teamName: string;
  managerName: string;
};

/**
 * Hirmukunto — pre-resolved. Random division team gets a
 * permanent strength buff equal to half their current strength.
 *
 * 1-1 port of `@/game/events/hirmukunto.ts`.
 */
const hirmukunto: DeclarativeEvent<HirmukuntoData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamFrom(["division"], false, [])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      duration: 1000,
      team: team.id,
      teamName: team.name,
      managerName: randomManager()(ctx).name
    };
  },

  render: (data) => [
    `Divisioonasta:

__${data.teamName}__ on päättänyt manageriguru ${data.managerName}:n johdolla nousta liigaan! He ovat _hirmukunnossa!_`
  ],

  process: (ctx, data) => {
    const strength = teamsStrength(data.team)(ctx);
    return [
      {
        type: "addTeamEffect",
        team: data.team,
        effect: {
          parameter: ["strength"],
          amount: Math.round(strength / 2),
          duration: data.duration
        }
      }
    ];
  }
};

export default hirmukunto;
