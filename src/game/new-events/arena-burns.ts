import arenas from "@/data/arenas";
import {
  managerHasService,
  managersArena,
  managersDifficulty
} from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "arenaBurns";

export type ArenaBurnsData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  newArenaLevel: number;
  amount: number;
  hasInsurance: boolean;
};

/**
 * Arena burns — pre-resolved. Skipped on difficulty 0 or arena
 * level ≤5. Knocks arena down 3 levels. Insurance covers 3× the
 * new arena's price, +90 extra.
 *
 * 1-1 port of `@/game/events/arena-burns.ts`.
 */
const arenaBurns: DeclarativeEvent<ArenaBurnsData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (managersDifficulty(manager)(ctx) === 0) {
      return null;
    }
    const currentArena = managersArena(manager)(ctx);
    if (!currentArena || currentArena.level <= 5) {
      return null;
    }
    const newArenaLevel = currentArena.level - 3;
    const hasInsurance = managerHasService(manager, "insurance")(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      newArenaLevel,
      amount: hasInsurance ? arenas[newArenaLevel].price * 3 : 0,
      hasInsurance
    };
  },

  render: (data) => {
    const t = [`Hallissa riehunut tulipalo huonontaa sen ominaisuuksia. ÖRR!`];
    if (data.hasInsurance) {
      t.push(`Etelälä joutuu korvaamaan tuhoja ${a(data.amount)} pekalla!`);
    }
    return t;
  },

  process: (_ctx, data) => {
    const effects: EventEffect[] = [
      {
        type: "setArenaLevel",
        manager: data.manager,
        level: data.newArenaLevel
      }
    ];
    if (data.hasInsurance) {
      effects.push({
        type: "incrementBalance",
        manager: data.manager,
        amount: data.amount
      });
      effects.push({
        type: "incrementInsuranceExtra",
        manager: data.manager,
        amount: 90
      });
    }
    return effects;
  }
};

export default arenaBurns;
