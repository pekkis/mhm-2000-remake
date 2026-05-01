import {
  managerHasService,
  managerObject,
  managersDifficulty
} from "@/machines/selectors";
import { currency } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "embezzlement";

export type EmbezzlementData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  amountEmbezzled: number;
  amountReimbursed: number;
};

const embezzledAmount = (balance: number, difficulty: number): number => {
  if (difficulty < 3) {
    return Math.round(0.1 * balance);
  }
  if (difficulty === 3) {
    return Math.round(0.15 * balance);
  }
  return Math.round(0.25 * balance);
};

/**
 * Embezzlement — pre-resolved. Skipped if balance <100 000.
 * Treasurer skims 10/15/25% by difficulty. Insurance reimburses
 * 80%; insurance extra +reimbursed/60.
 *
 * 1-1 port of `@/game/events/embezzlement.ts`.
 */
const embezzlement: DeclarativeEvent<EmbezzlementData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const m = managerObject(manager)(ctx);
    if (!m || m.balance < 100000) {
      return null;
    }
    const difficulty = managersDifficulty(manager)(ctx);
    const amountEmbezzled = embezzledAmount(m.balance, difficulty);
    const hasInsurance = managerHasService(manager, "insurance")(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      amountEmbezzled,
      amountReimbursed: hasInsurance ? Math.round(0.8 * amountEmbezzled) : 0
    };
  },

  render: (data) => {
    const t = [
      `Yksi johtokunnan jäsen katoaa, vieden mukanaan aimo siivun joukkueen kassasta. Tililtänne uupuu yhteensä __${currency(data.amountEmbezzled)}__.`
    ];
    if (data.amountReimbursed) {
      t.push(
        `Etelälä maksaa teille korvauksena __${currency(data.amountReimbursed)}__.`
      );
    }
    return t;
  },

  process: (_ctx, data) => {
    const effects: EventEffect[] = [
      {
        type: "decrementBalance",
        manager: data.manager,
        amount: data.amountEmbezzled
      }
    ];
    if (data.amountReimbursed) {
      effects.push({
        type: "incrementBalance",
        manager: data.manager,
        amount: data.amountReimbursed
      });
      effects.push({
        type: "incrementInsuranceExtra",
        manager: data.manager,
        amount: Math.round(data.amountReimbursed / 60)
      });
    }
    return effects;
  }
};

export default embezzlement;
