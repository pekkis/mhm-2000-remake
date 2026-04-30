import { managersTeam } from "@/machines/selectors";
import random from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "paajanen";

export type PaajanenData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  duration: number;
};

/**
 * Paajanen — pre-resolved. You flip off ref Hekka Paajanen and
 * eat a `cinteger(0,3) + 2` round officials' ban; team strength
 * −14% for the duration.
 *
 * 1-1 port of `@/game/events/paajanen.ts`.
 */
const paajanen: DeclarativeEvent<PaajanenData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    duration: random.cinteger(0, 3) + 2
  }),

  render: (data) => [
    `Ottelun tuomari __Hekka Paajanen__ oli todella surkea. Kolmannessa erässä, saatuanne jäähyn syyttä, kohotat syyttävän keskisormesi miestä kohti ja lausut pari valittua sanaa hänen taidoistaan!

Kurinpitovaliokunta lätkäisee sinulle ${data.duration} ottelun toimitsijakiellon!`
  ],

  process: (ctx, data) => {
    const team = managersTeam(data.manager)(ctx);
    return [
      {
        type: "addTeamEffect",
        team: team.id,
        effect: {
          parameter: ["strength"],
          amount: -Math.round(0.14 * team.strength),
          duration: data.duration
        }
      }
    ];
  }
};

export default paajanen;
