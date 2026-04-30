import {
  managerHasService,
  managersArena,
  managersDifficulty,
  managersMainCompetition,
  managersTeam
} from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "mcHabadobo";

export type McHabadoboData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  hasInsurance: boolean;
  amount: number;
  insuranceClaim: number;
  arenaLevel: number;
};

/**
 * MC Habadobo — pre-resolved. Skipped unless: difficulty ≥3, PHL,
 * team strength ≥250. Bazooka strike at the merch shop;
 * −650 000 pekka. Insurance covers 80%, +40·(arena.level + 1)
 * extra.
 *
 * 1-1 port of `@/game/events/mc-habadobo.ts`. Arena level
 * snapshotted in create so process is deterministic.
 */
const mcHabadobo: DeclarativeEvent<McHabadoboData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (managersDifficulty(manager)(ctx) < 3) {
      return null;
    }
    if (managersMainCompetition(manager)(ctx) !== "phl") {
      return null;
    }
    const team = managersTeam(manager)(ctx);
    if (team.strength < 250) {
      return null;
    }
    const arena = managersArena(manager)(ctx);
    if (!arena) {
      return null;
    }
    const amount = 650000;
    return {
      eventId,
      manager,
      resolved: true,
      hasInsurance: managerHasService(manager, "insurance")(ctx),
      amount,
      insuranceClaim: Math.round(0.8 * amount),
      arenaLevel: arena.level
    };
  },

  render: (data) => {
    const t = [
      `Joukkueen fanikaupan vieressä sijaitsevaan moottoripyöräkerho __MC Habadobon__ isännöimään kapakkaan suunnattu leikkimielinen sinkoisku osuu harhaan!

Lukematon määrä fanituotteita ja muuta krääsää tuhoutuu. Lasku kohoaa ${a(data.amount)} pekkaan!`
    ];
    if (data.hasInsurance) {
      t.push(`Etelälä maksaa laskusta ${a(data.insuranceClaim)} pekkaa.`);
    }
    return t;
  },

  process: (_ctx, data) => {
    const effects: EventEffect[] = [
      { type: "decrementBalance", manager: data.manager, amount: data.amount }
    ];
    if (data.hasInsurance) {
      effects.push({
        type: "incrementBalance",
        manager: data.manager,
        amount: data.insuranceClaim
      });
      effects.push({
        type: "incrementInsuranceExtra",
        manager: data.manager,
        amount: 40 * (data.arenaLevel + 1)
      });
    }
    return effects;
  }
};

export default mcHabadobo;
