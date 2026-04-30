import { randomTeamFrom, teamsStrength } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "jatovrel";

export type JatovrelData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  duration: number;
  team: number;
  teamName: string;
};

/**
 * Jatovrel — pre-resolved. Random PHL team's Czech import is out;
 * permanent strength −14, plus −33% of post-decrement strength
 * for 1000 rounds.
 *
 * 1-1 port of `@/game/events/jatovrel.ts`. Saga decremented first
 * then computed the effect from the new strength — mirrored by
 * subtracting 14 before the percentage calculation.
 */
const jatovrel: DeclarativeEvent<JatovrelData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      duration: 1000,
      team: team.id,
      teamName: team.name
    };
  },

  render: (data) => [
    `Liigasta:

__${data.teamName}__ on joutunut kauhean tapaturman uhriksi. Heidän tshekkivahvistuksensa __Oreslav Jatovrel__ on törmännyt laitaan kohtalokkain seurauksin. Jatovrelin ura on paketissa, ja joukkue shokissa!

Kaikki toivovat tiukennusta sääntöihin, ja liigan johto myös lupaa niitä. _toim. huom. Jaroslav Otevrel never forget 2019_`
  ],

  process: (ctx, data) => {
    const strengthAfterDecrement = teamsStrength(data.team)(ctx) - 14;
    return [
      { type: "incrementStrength", team: data.team, amount: -14 },
      {
        type: "addTeamEffect",
        team: data.team,
        effect: {
          parameter: ["strength"],
          amount: Math.round(-0.33 * strengthAfterDecrement),
          duration: data.duration
        }
      }
    ];
  }
};

export default jatovrel;
