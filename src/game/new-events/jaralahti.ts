import { amount as a, currency } from "@/services/format";
import {
  managerHasService,
  managersTeamId,
  teamCompetesIn
} from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "jaralahti";

export type JaralahtiData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  amount: number;
  /** Player chose to bribe the militia. Set on resolve. */
  support?: boolean;
  /** Snapshotted at resolve time so process() doesn't re-read ctx. */
  hasInsurance?: boolean;
};

const texts = (data: JaralahtiData): string[] => {
  const lines = [
    `Miliisi soittaa kotiisi yöllä. Tähtipuolustajasi __Kale Jaralahti__ on juuri narahtanut kaupungin keskustassa auton ratista huumepöllyssä.`
  ];

  if (!data.resolved) {
    return lines;
  }

  if (!data.support) {
    lines.push("Pelaaja katoaa lopullisesti aamuun mennessä!");
    if (data.hasInsurance) {
      lines.push(`Vakuutusyhtiö maksaa sinulle ${a(data.amount)}.`);
    }
    return lines;
  }

  lines.push(
    `Rahaa kuluu, mutta pelaaja on kiitollinen. Hän parantaa tasoansa (ja lupaa pyhästi parantaa tapansa)!`
  );
  return lines;
};

/**
 * Jaralahti — interactive event. Star defender busted DUI; player
 * chooses to bribe (skill +) or wash hands (skill −, insurance maybe
 * pays out).
 *
 * 1-1 port of the saga version in `@/game/events/jaralahti.ts`.
 * The PHL/division strength multiplier is computed at process time
 * (read-only ctx access) — same as the saga.
 */
const jaralahti: DeclarativeEvent<JaralahtiData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    amount: 75000,
    resolved: false
  }),

  options: (data) => ({
    support: `Lahjoitan miliisien virkistysrahastoon ${currency(data.amount)}.`,
    nothing: "Lyön luurin korvaan ja sanoudun irti koko hommasta!"
  }),

  resolve: (ctx, data, value) => ({
    ...data,
    resolved: true,
    support: value === "support",
    hasInsurance: managerHasService(data.manager, "insurance")(ctx)
  }),

  render: texts,

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const competesInPHL = teamCompetesIn(team, "phl")(ctx);
    const multiplier = competesInPHL ? 2 : 1;

    const effects: EventEffect[] = [];

    if (!data.support) {
      effects.push({
        type: "decrementStrength",
        team,
        amount: 7 * multiplier
      });
      if (data.hasInsurance) {
        effects.push({
          type: "incrementBalance",
          manager: data.manager,
          amount: data.amount
        });
      }
    } else {
      effects.push({
        type: "incrementStrength",
        team,
        amount: 4 * multiplier
      });
      effects.push({
        type: "decrementBalance",
        manager: data.manager,
        amount: data.amount
      });
    }

    return effects;
  }
};

export default jaralahti;
