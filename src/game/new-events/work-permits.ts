import { randomTeamFrom } from "@/machines/selectors";
import { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "workPermits";

export type WorkPermitsData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  duration: number;
  team: number;
  teamName: string;
};

/**
 * Work permits — pre-resolved. A random PHL team's foreign
 * imports lose their work permits; strength −35 for
 * `cinteger(0,3) + 3` rounds.
 *
 * 1-1 port of `@/game/events/work-permits.ts`.
 */
const workPermits: DeclarativeEvent<WorkPermitsData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      duration: cinteger(0, 3) + 3,
      team: team.id,
      teamName: team.name
    };
  },

  render: (data) => [
    `Liigasta:

${data.teamName}:lla on ongelmia ulkolaisvahvistustensa, Haso Otchakin sekä Malex Atsijevskin, työlupien kanssa. Joukkue heikentyy merkittävästi ${data.duration} ottelun ajaksi kun kyseiset herrat eivät pelaa.`
  ],

  process: (_ctx, data) => [
    {
      type: "addTeamEffect",
      team: data.team,
      effect: { parameter: ["strength"], amount: -35, duration: data.duration }
    }
  ]
};

export default workPermits;
