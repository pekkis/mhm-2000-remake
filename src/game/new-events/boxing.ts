import { managersTeamId, randomManager } from "@/machines/selectors";
import { currency } from "@/services/format";
import { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "boxing";

export type BoxingData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  otherManager: string;
  resolved: boolean;
  amount: number;
  agree?: boolean;
  /** Index into `results`. False when the player declined. */
  result?: number | false;
};

const results: { text: (data: BoxingData) => string; moraleGain: number }[] = [
  {
    text: () => `Ottelu päättyy hienosti: tyrmäät vastustajasi!`,
    moraleGain: 10
  },
  { text: () => `Ottelu päättyy hyväksesi tuomariäänin!`, moraleGain: 6 },
  { text: () => `Ottelu päättyy tasapeliin!`, moraleGain: 4 },
  { text: () => `Ottelu päättyy tappioosi tuomariäänillä!`, moraleGain: 3 },
  {
    text: (data) =>
      `Ottelu päättyy, kun vastustajasi tyrmää sinut! Lääkärilasku kohoaa ${currency(data.amount)}.`,
    moraleGain: 1
  }
];

/**
 * Boxing — interactive event. Random other manager challenges you
 * to a boxing match. Accept rolls `cinteger(0,4)` for the
 * outcome (snapshotted at resolve so process is deterministic).
 *
 * 1-1 port of `@/game/events/boxing.ts`.
 */
const boxing: DeclarativeEvent<BoxingData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    otherManager: randomManager()(ctx).name,
    amount: 10000,
    resolved: false
  }),

  options: () => ({
    agree: `Otan haasteen vastaan. Nyrkkini on kova ja voittoni varma!`,
    disagree: `En ota haastetta vastaan. Aivoni ovat kovat, nyrkkini pehmeät.`
  }),

  resolve: (_ctx, data, value) => ({
    ...data,
    resolved: true,
    agree: value === "agree",
    result: value === "agree" ? cinteger(0, 4) : false
  }),

  render: (data) => {
    const lines = [
      `Manageri __${data.otherManager}__ haastaa sinut nyrkkeilyotteluun! Otatko haasteen vastaan?`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (data.agree) {
      lines.push(results[data.result as number].text(data));
    } else {
      lines.push(
        `Selvä. __${data.otherManager}__ haukkuu sinut julkisesti pelkuriksi ja _nörtiksi_!`
      );
    }
    return lines;
  },

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const effects: EventEffect[] = [];
    if (data.agree) {
      const r = results[data.result as number];
      effects.push({ type: "incrementMorale", team, amount: r.moraleGain });
      if (data.result === 4) {
        effects.push({
          type: "decrementBalance",
          manager: data.manager,
          amount: data.amount
        });
      }
    } else {
      effects.push({ type: "decrementMorale", team, amount: 7 });
    }
    return effects;
  }
};

export default boxing;
