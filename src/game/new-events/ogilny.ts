import { randomTeamFrom } from "@/machines/selectors";
import { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "ogilny";

export type OgilnyData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  duration: number;
  team: number;
  teamName: string;
};

/**
 * Ogilny — pre-resolved. Random PHL team's Russian forward gets
 * crocked; strength −15 for `cinteger(0,2) + 1` rounds.
 *
 * 1-1 port of `@/game/events/ogilny.ts`.
 */
const ogilny: DeclarativeEvent<OgilnyData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      duration: cinteger(0, 2) + 1,
      team: team.id,
      teamName: team.name
    };
  },

  render: (data) => [
    `Liigasta:

Auts! ${data.teamName}:n liukas venäläishyökkääjä Malexander Ogilny loukkaa nivusensa kun viuhuva lämäri kolahtaa sopivasti oikeaan paikkaan. Mies on poissa ${data.duration} viikkoa.`
  ],

  process: (_ctx, data) => [
    {
      type: "addTeamEffect",
      team: data.team,
      effect: { parameter: ["strength"], amount: -15, duration: data.duration }
    }
  ]
};

export default ogilny;
