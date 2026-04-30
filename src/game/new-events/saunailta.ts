import { managersMainCompetition, managersTeamId } from "@/machines/selectors";
import random from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "saunailta";

export type SaunailtaData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  effect: number;
  duration: number;
};

/**
 * Saunailta — pre-resolved. Sauna evening turns into a brawl with
 * the team manager. Morale −5; strength −30 (PHL) or −20 (else)
 * for `cinteger(0,2) + 2` rounds.
 *
 * 1-1 port of `@/game/events/saunailta.ts`.
 */
const saunailta: DeclarativeEvent<SaunailtaData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const mainCompetition = managersMainCompetition(manager)(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      effect: mainCompetition === "phl" ? -30 : -20,
      duration: random.cinteger(0, 2) + 2
    };
  },

  render: () => [
    `Rento saunailta muuttuu katastrofiksi, kun ajaudutte joukkueenjohtajan kanssa käsirysyyn pelillisten erimielisyyksien vuoksi.

Mies saa luonnollisesti potkut, ja uutta joukkueenohtajaa etsitään. Moraali laskee, ja joukkueen peli menee vähäksi aikaa sekaisin.`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    return [
      { type: "incrementMorale", team, amount: -5 },
      {
        type: "addTeamEffect",
        team,
        effect: {
          parameter: ["strength"],
          amount: data.effect,
          duration: data.duration
        }
      }
    ];
  }
};

export default saunailta;
