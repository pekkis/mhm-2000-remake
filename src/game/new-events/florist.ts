import { randomTeamFrom } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "florist";

export type FloristData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  team: number;
  teamName: string;
};

/**
 * Florist — pre-resolved. A random PHL team's promising young centre
 * quits hockey to become a florist. Team strength −13.
 *
 * 1-1 port of `@/game/events/florist.ts`.
 */
const florist: DeclarativeEvent<FloristData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      team: team.id,
      teamName: team.name
    };
  },

  render: (data) => [
    `Liigasta:

__${data.teamName}__ on kokenut suuren menetyksen! Heidän lupaava, nuori sentterinsä lopettaa jääkiekkouransa floristi-opintojen takia!`
  ],

  process: (_ctx, data) => [
    { type: "decrementStrength", team: data.team, amount: 13 }
  ]
};

export default florist;
