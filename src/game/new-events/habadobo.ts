import { randomManager, randomTeamFrom } from "@/machines/selectors";
import { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "habadobo";

export type HabadoboData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  duration: number;
  team: number;
  teamName: string;
  managerName: string;
  newManagerName: string;
};

/**
 * Habadobo — pre-resolved. Random PHL team's manager-system flops;
 * strength −40 for `cinteger(0,6) + 6` rounds.
 *
 * 1-1 port of `@/game/events/habadobo.ts`.
 */
const habadobo: DeclarativeEvent<HabadoboData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    const r1 = randomManager()(ctx);
    const r2 = randomManager([r1.id])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      duration: cinteger(0, 6) + 6,
      team: team.id,
      teamName: team.name,
      managerName: r1.name,
      newManagerName: r2.name
    };
  },

  render: (data) => [
    `Liigasta:

Managerivelho ${data.managerName}:n _HabaDobo-systeemi_ on osoittautunut suureksi flopiksi! __${data.teamName}__:n pelaajat eivät pysty noudattamaan käsittämättömiä kuvioita.

${data.managerName} saa potkut. Tilalle tulee ${data.newManagerName}, jolla on kova työ saada joukkue jaloilleen.`
  ],

  process: (_ctx, data) => [
    {
      type: "addTeamEffect",
      team: data.team,
      effect: {
        parameter: ["strength"],
        amount: -40,
        duration: data.duration
      }
    }
  ]
};

export default habadobo;
