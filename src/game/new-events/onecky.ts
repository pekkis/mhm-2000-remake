import { randomManager, randomTeamFrom } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "onecky";

export type OneckyData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  team: number;
  teamName: string;
  otherManager: string;
};

/**
 * Onecky — pre-resolved. PHL pig Jatakar Onecky tries to skate-kick
 * an opponent; powerful manager backer covers it up. Affected team
 * morale −5 for 3 rounds.
 *
 * 1-1 port of `@/game/events/onecky.ts`.
 */
const onecky: DeclarativeEvent<OneckyData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    const r = randomManager()(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      team: team.id,
      teamName: team.name,
      otherManager: r.name
    };
  },

  render: (data) => [
    `__${data.teamName}__ pääsee otsikoihin, kun joukkueessa pelaava __Jatakar Onecky__, liigan suurin sika, yrittää potkaista vastustajaansa luistimella naamaan.

Tuomari seisoo vieressä, mutta Oneckyn vaikutusvaltainen tukija, manageri ${data.otherManager}, hoitaa asian siten, että Onecky selviää ilman seuraamuksia."`
  ],

  process: (_ctx, data) => [
    {
      type: "addTeamEffect",
      team: data.team,
      effect: { parameter: ["morale"], amount: -5, duration: 3 }
    }
  ]
};

export default onecky;
