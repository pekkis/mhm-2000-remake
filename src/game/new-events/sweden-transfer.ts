import {
  managerHasService,
  managersTeamId,
  teamCompetesIn
} from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "swedenTransfer";

export type SwedenTransferData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  team: number;
  amount: number;
  hasInsurance: boolean;
  moraleBoost: number;
  strengthLoss: number;
};

/**
 * Sweden transfer — pre-resolved. Young talent leaves; +30 000
 * pekka, strength −12/−7 (PHL/div), morale −2/+2 (PHL/div).
 * Insurance pays half again, +100 extra.
 *
 * 1-1 port of `@/game/events/sweden-transfer.ts`.
 */
const swedenTransfer: DeclarativeEvent<SwedenTransferData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = managersTeamId(manager)(ctx);
    const playsInPHL = teamCompetesIn(team, "phl")(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      team,
      amount: 30000,
      hasInsurance: managerHasService(manager, "insurance")(ctx),
      moraleBoost: playsInPHL ? -2 : 2,
      strengthLoss: playsInPHL ? 12 : 7
    };
  },

  render: (data) => {
    const t = [
      `Joukkueen nuori, lupaava taituri siirtyy Ruotsiin kesken kauden. Nyyh! Ruotsalaiset korvaavat menetyksen ${a(data.amount)} pekalla!`
    ];
    if (data.hasInsurance) {
      t.push(`Etelälältä saat lisäksi ${a(data.amount)} pekkaa.`);
    }
    return t;
  },

  process: (_ctx, data) => {
    const effects: EventEffect[] = [
      {
        type: "incrementStrength",
        team: data.team,
        amount: -data.strengthLoss
      },
      { type: "incrementMorale", team: data.team, amount: data.moraleBoost },
      {
        type: "incrementBalance",
        manager: data.manager,
        amount: data.amount
      }
    ];
    if (data.hasInsurance) {
      effects.push({
        type: "incrementBalance",
        manager: data.manager,
        amount: data.amount / 2
      });
      effects.push({
        type: "incrementInsuranceExtra",
        manager: data.manager,
        amount: 100
      });
    }
    return effects;
  }
};

export default swedenTransfer;
