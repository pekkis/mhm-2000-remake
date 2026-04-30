import { flag, managerCompetesIn, managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "haanperaDivorce";

export type HaanperaDivorceData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
};

/**
 * Haanperä divorce — pre-resolved. Only fires while `haanperaMarried`
 * flag is set. Strength gain: 8 (PHL) / 4 (division). Clears the
 * flag.
 *
 * 1-1 port of `@/game/events/haanpera-divorce.ts`.
 */
const haanperaDivorce: DeclarativeEvent<HaanperaDivorceData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (!flag("haanperaMarried")(ctx)) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true
    };
  },

  render: () => [
    `Pelaaja Aki Haanperän avioliitto päättyy eroon! Mies on onnellinen kun pääsee eroon nalkuttavasta vaimosta ja parantaa otteitaan!`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const phl = managerCompetesIn(data.manager, "phl")(ctx);
    const skillGain = phl ? 8 : 4;
    const effects: EventEffect[] = [
      { type: "incrementStrength", team, amount: skillGain },
      { type: "setGameFlag", flag: "haanperaMarried", value: false }
    ];
    return effects;
  }
};

export default haanperaDivorce;
