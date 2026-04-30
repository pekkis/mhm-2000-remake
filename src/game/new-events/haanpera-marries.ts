import { flag, managersTeam } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "haanperaMarries";

export type HaanperaMarriesData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
};

/**
 * Haanperä marries — pre-resolved. Only fires while
 * `haanperaMarried` flag is unset. Bachelor party hangover saps
 * team strength by ~33% for one round and bumps morale +4. Sets
 * the flag.
 *
 * 1-1 port of `@/game/events/haanpera-marries.ts`.
 */
const haanperaMarries: DeclarativeEvent<HaanperaMarriesData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (flag("haanperaMarried")(ctx)) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true
    };
  },

  render: () => [
    `Pelaaja Aki Haanperän polttarit ovat seuraavana iltana. Koko joukkue on mukana ja kankkunen vaivaa seuraavan ottelun ajan!`
  ],

  process: (ctx, data) => {
    const team = managersTeam(data.manager)(ctx);
    const effects: EventEffect[] = [
      {
        type: "addTeamEffect",
        team: team.id,
        effect: {
          parameter: ["strength"],
          amount: -Math.round(team.strength * 0.33),
          duration: 1
        }
      },
      { type: "incrementMorale", team: team.id, amount: 4 },
      { type: "setGameFlag", flag: "haanperaMarried", value: true }
    ];
    return effects;
  }
};

export default haanperaMarries;
