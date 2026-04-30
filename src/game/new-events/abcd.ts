import {
  randomManager,
  randomTeamFrom,
  teamsStrength
} from "@/machines/selectors";
import random from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "abcd";

export type AbcdData = {
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
 * Abcd — pre-resolved. A wizard-manager has psyched a PHL team to
 * incomprehensible form via the "ABCD program". Affected team gets
 * a +25% strength buff for `duration` rounds.
 *
 * 1-1 port of `@/game/events/abcd.ts`.
 */
const abcd: DeclarativeEvent<AbcdData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    const r = randomManager()(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      duration: random.cinteger(0, 6) + 3,
      team: team.id,
      teamName: team.name,
      managerName: r.name
    };
  },

  render: (data) => [
    `Liigasta:

Managerivelho ${data.managerName} on saanut psyykattua ${data.teamName}:n käsittämättömään vireeseen! Hänen nk. "ABCD-ohjelmansa" puree!`
  ],

  process: (ctx, data) => {
    const strength = teamsStrength(data.team)(ctx);
    return [
      {
        type: "addTeamEffect",
        team: data.team,
        effect: {
          parameter: ["strength"],
          amount: Math.round(strength / 4),
          duration: data.duration
        }
      }
    ];
  }
};

export default abcd;
