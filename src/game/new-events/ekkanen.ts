import {
  managersArena,
  managersBalance,
  managersDifficulty,
  managersTeamId
} from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "ekkanen";

export type EkkanenData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  strength: number;
  amount: number;
  expandArena: boolean;
  giveMoney: boolean;
  duration: number;
  newArenaLevel: number;
};

/**
 * Ekkanen — pre-resolved. NHL star returns home; team strength
 * +17. On low difficulty + low arena level, pays for arena
 * upgrade. On low difficulty + low balance, donates 500 000 pekka.
 *
 * 1-1 port of `@/game/events/ekkanen.ts`. New arena level
 * snapshotted in create so process is deterministic.
 */
const ekkanen: DeclarativeEvent<EkkanenData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const difficulty = managersDifficulty(manager)(ctx);
    const arena = managersArena(manager)(ctx);
    const balance = managersBalance(manager)(ctx);
    const expandArena = !!arena && difficulty < 4 && arena.level < 5;
    return {
      eventId,
      manager,
      resolved: true,
      strength: 17,
      amount: 500000,
      expandArena,
      giveMoney: difficulty < 2 && balance < 500000,
      duration: 6,
      newArenaLevel: expandArena && arena ? arena.level + 1 : 0
    };
  },

  render: (data) => {
    const t = [
      `Tisa Ekkanen, loistava NHL-pelaaja, palaa kotimaahan monien vuosien jälkeen. Hän liittyy joukkueeseen ilmaiseksi!`
    ];
    if (data.expandArena) {
      t.push(
        `Ekkanen on erityisen hövelillä päällä ja kustantaa hallisi laajennuksen.`
      );
    }
    if (data.giveMoney) {
      t.push(
        `Eikä siinä vielä kaikki. Ekkanen lahjoittaa seuralle ${a(data.amount)} pekkaa kylmää käteistä.`
      );
    }
    return t;
  },

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const effects: EventEffect[] = [
      { type: "incrementStrength", team, amount: data.strength }
    ];
    if (data.expandArena) {
      effects.push({
        type: "setArenaLevel",
        manager: data.manager,
        level: data.newArenaLevel
      });
    }
    if (data.giveMoney) {
      effects.push({
        type: "incrementBalance",
        manager: data.manager,
        amount: data.amount
      });
    }
    return effects;
  }
};

export default ekkanen;
