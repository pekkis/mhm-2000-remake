import { randomTeamFrom } from "@/machines/selectors";
import random from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "randomDude";

export type RandomDudeData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  strengthGain: number;
  team: number;
  teamName: string;
};

/**
 * Random dude — pre-resolved. A random division team buys an unknown
 * foreign player; strength +`cinteger(0,10)+1`.
 *
 * 1-1 port of `@/game/events/random-dude.ts`.
 */
const randomDude: DeclarativeEvent<RandomDudeData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = randomTeamFrom(["division"], false, [])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      strengthGain: random.cinteger(0, 10) + 1,
      team: team.id,
      teamName: team.name
    };
  },

  render: (data) => [
    `Divisioonasta:

__${data.teamName}__ ostaa ulkolaisvahvistuksen, josta kukaan ei ole koskaan kuullut puhuttavankaan! Miehen pelikunto on siis täysi arvoitus.`
  ],

  process: (_ctx, data) => [
    { type: "incrementStrength", team: data.team, amount: data.strengthGain }
  ]
};

export default randomDude;
