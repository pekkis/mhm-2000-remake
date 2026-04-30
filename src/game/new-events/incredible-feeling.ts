import { randomManager, randomTeamOrNullFrom } from "@/machines/selectors";
import type { Team } from "@/state/game";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "incredibleFeeling";

export type IncredibleFeelingData = {
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
 * Incredible feeling — pre-resolved. A weak (strength <200) PHL
 * team gets a permanent (+1000-round) +50 strength buff.
 *
 * 1-1 port of `@/game/events/incredible-feeling.ts`.
 */
const incredibleFeeling: DeclarativeEvent<IncredibleFeelingData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamOrNullFrom(
      ["phl"],
      false,
      [],
      (t: Team) => t.strength < 200
    )(ctx);
    if (!team) {
      return null;
    }
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
    `Kovin nimetön __${data.teamName}__ on saanut uskomattoman fiiliksen päälle! Kaikki pelaavat vain joukkueen menestyksen eteen, ja manageri __${data.managerName}__ lupaa pelaajiensa jaksavan koko pitkän kauden loppuun!`
  ],

  process: (_ctx, data) => [
    {
      type: "addTeamEffect",
      team: data.team,
      effect: { parameter: ["strength"], amount: 50, duration: data.duration }
    }
  ]
};

export default incredibleFeeling;
