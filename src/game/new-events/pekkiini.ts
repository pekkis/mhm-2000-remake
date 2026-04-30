import { managersDifficulty, managersTeam } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "pekkiini";

export type PekkiiniData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  team: number;
  amount: number;
  duration: number;
};

/**
 * Pekkiini — pre-resolved. New stimulant pekkiini hits the streets;
 * legal for `7 - difficulty` weeks. Team strength buff = `+50%`
 * for the duration. Team id snapshotted at create so a manager
 * change mid-buff doesn't redirect the effect.
 *
 * 1-1 port of `@/game/events/pekkiini.ts`.
 */
const pekkiini: DeclarativeEvent<PekkiiniData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = managersTeam(manager)(ctx);
    if (!team) {
      return null;
    }
    const difficulty = managersDifficulty(manager)(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      team: team.id,
      amount: Math.round(team.strength * 0.5),
      duration: 7 - difficulty
    };
  },

  render: (data) => [
    `On löytynyt uusi piriste, __pekkiini__, jota ei ole vielä ehditty kieltämään. Laki aineen kiellosta astuu valitettavasti voimaan jo _${data.duration} viikon kuluttua_, mutta tohtorinne pumppaa pelaajat täyteen tehoainetta niin pitkäksi aikaa kuin mahdollista!`
  ],

  process: (_ctx, data) => [
    {
      type: "addTeamEffect",
      team: data.team,
      effect: {
        parameter: ["strength"],
        amount: data.amount,
        duration: data.duration
      }
    }
  ]
};

export default pekkiini;
