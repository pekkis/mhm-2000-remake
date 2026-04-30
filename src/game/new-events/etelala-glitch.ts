import { managerObject } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "etelalaGlitch";

export type EtelalaGlitchData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
};

/**
 * Etelälä glitch — pre-resolved. Insurance company database hacked;
 * the manager's accumulated insurance bonuses zero out.
 *
 * 1-1 port of `@/game/events/etelala-glitch.ts`. Saga read the
 * current value and applied a negative delta; here we just `setInsuranceExtra`
 * to zero — same end state, simpler.
 */
const etelalaGlitch: DeclarativeEvent<EtelalaGlitchData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (!managerObject(manager)(ctx)) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true
    };
  },

  render: () => [
    `__Etelälän__ tietokoneeseen on iskenyt _virus_! Kaikki vakuutustiedot ovat kadonneet, ja siten bonukset nollautuvat!`
  ],

  process: (_ctx, data) => [
    { type: "setInsuranceExtra", manager: data.manager, extra: 0 }
  ]
};

export default etelalaGlitch;
