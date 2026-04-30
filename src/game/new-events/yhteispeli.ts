import { randomManager, randomTeamOrNullFrom } from "@/machines/selectors";
import random from "@/services/random";
import type { Team } from "@/state/game";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "yhteispeli";

export type YhteispeliData = {
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
 * Yhteispeli — pre-resolved. Strong (>120) division team's
 * teamwork falls apart; strength −30 for `cinteger(0,10) + 7`
 * rounds.
 *
 * 1-1 port of `@/game/events/yhteispeli.ts`.
 */
const yhteispeli: DeclarativeEvent<YhteispeliData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamOrNullFrom(
      ["division"],
      false,
      [],
      (t: Team) => t.strength > 120
    )(ctx);
    if (!team) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true,
      duration: random.cinteger(0, 10) + 7,
      team: team.id,
      teamName: team.name,
      managerName: randomManager()(ctx).name
    };
  },

  render: (data) => [
    `Divisioonasta:

Manageri ${data.managerName}:lla on käsissään huippujoukkue __${data.teamName}__. Taitavista yksilöistä koostuvalla joukkueella on kuitenkin tällä hetkellä suuria ongelmia yhteispelinsä kanssa.`
  ],

  process: (_ctx, data) => [
    {
      type: "addTeamEffect",
      team: data.team,
      effect: { parameter: ["strength"], amount: -30, duration: data.duration }
    }
  ]
};

export default yhteispeli;
