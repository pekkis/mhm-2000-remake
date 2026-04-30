import { flag } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "attitudeCanada";

const difference = 30;

export type AttitudeCanadaData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  attitude: boolean;
  resolved: true;
};

/**
 * Attitude Canada — pre-resolved. Toggles the `canada` flag and
 * shifts CA country strength by ±30.
 *
 * 1-1 port of `@/game/events/attitude-canada.ts`.
 */
const attitudeCanada: DeclarativeEvent<AttitudeCanadaData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    attitude: !flag("canada")(ctx)
  }),

  render: (data) => {
    const lines = [
      `__Kanadassa__ asenne MM-kisoja kohtaan on muuttunut radikaalisti.`
    ];
    if (data.attitude === true) {
      lines.push(`Tästä edespäin kaikki supertähdet tulevat kisoihin!`);
    } else {
      lines.push(`Tästä lähtien heitä edustaa rupuinen yliopistojoukkue!`);
    }
    return lines;
  },

  process: (_ctx, data) => [
    { type: "setGameFlag", flag: "canada", value: data.attitude },
    {
      type: "alterCountryStrength",
      country: "CA",
      amount: data.attitude ? difference : -difference
    }
  ]
};

export default attitudeCanada;
