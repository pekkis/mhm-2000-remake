import { randomManager, randomTeamFrom } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "youStalk";

export type YouStalkData = {
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
 * You stalk — pre-resolved. Newspapers report you eyeing another
 * team's job. That team's strength −15 for 5 rounds.
 *
 * 1-1 port of `@/game/events/you-stalk.ts`.
 */
const youStalk: DeclarativeEvent<YouStalkData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    const r = randomManager()(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      duration: 5,
      team: team.id,
      teamName: team.name,
      managerName: r.name
    };
  },

  render: (data) => [
    `Liigasta:

__${data.managerName}__ valmentaa joukkuetta __${data.teamName}__. Sinä kyttäät lehtien mukaan hänen paikkaansa, ja joukkue-paran pakka menee hetkeksi hiukan sekaisin!`
  ],

  process: (_ctx, data) => [
    {
      type: "addTeamEffect",
      team: data.team,
      effect: { parameter: ["strength"], amount: -15, duration: data.duration }
    }
  ]
};

export default youStalk;
