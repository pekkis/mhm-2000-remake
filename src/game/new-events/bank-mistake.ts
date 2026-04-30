import { managersDifficulty } from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "bankMistake";

export type BankMistakeData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amount: number;
  bribe: number | false;
};

/**
 * Bank mistake — pre-resolved. +500 000 pekka. On difficulty 4 a
 * blackmailing player extracts a 200 000 pekka bribe.
 *
 * 1-1 port of `@/game/events/bank-mistake.ts`.
 */
const bankMistake: DeclarativeEvent<BankMistakeData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const difficulty = managersDifficulty(manager)(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      amount: 500000,
      bribe: difficulty === 4 ? 200000 : false
    };
  },

  render: (data) => {
    const t = [
      `Pankkinne on tehnyt virheen. Tilillänne on __${a(data.amount)}__ pekkaa liikaa. Kukaan ei huomaa mitään...`
    ];
    if (data.bribe) {
      t.push(
        `... paitsi yksi erittäin tarkkaavainen pelaaja, jonka vaikeneminen maksaa __${a(data.bribe)}__ pekkaa.`
      );
    }
    return t;
  },

  process: (_ctx, data) => {
    const effects: EventEffect[] = [
      { type: "incrementBalance", manager: data.manager, amount: data.amount }
    ];
    if (data.bribe) {
      effects.push({
        type: "decrementBalance",
        manager: data.manager,
        amount: data.bribe
      });
    }
    return effects;
  }
};

export default bankMistake;
