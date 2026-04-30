import { flag } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "attitudeUSA";

const difference = 35;

export type AttitudeUSAData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  attitude: boolean;
  resolved: true;
};

/**
 * Attitude USA — pre-resolved. Toggles the `usa` flag and shifts
 * US country strength by ±35.
 *
 * 1-1 port of `@/game/events/attitude-usa.ts`.
 */
const attitudeUSA: DeclarativeEvent<AttitudeUSAData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    attitude: !flag("usa")(ctx)
  }),

  render: (data) => {
    const lines = [
      `__Yhdysvalloissa__ asenne MM-kisoja kohtaan on muuttunut radikaalisti.`
    ];
    if (data.attitude === true) {
      lines.push(
        `Tästä edespäin kaikki parhaat jenkinpurijat tulevat kisoihin!`
      );
    } else {
      lines.push(`Tästä lähtien supertähdet pysyvät kotona Jenkeissä.`);
    }
    return lines;
  },

  process: (_ctx, data) => [
    { type: "setGameFlag", flag: "usa", value: data.attitude },
    {
      type: "alterCountryStrength",
      country: "US",
      amount: data.attitude ? difference : -difference
    }
  ]
};

export default attitudeUSA;
