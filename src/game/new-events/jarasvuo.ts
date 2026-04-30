import { managerCompetesIn, managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "jarasvuo";

export type JarasvuoData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  solution?: "fine" | "ban" | "nothing";
};

/**
 * Jarasvuo — interactive 3-option event. Star player slags off
 * teammates on TV; pick fine (small balance gain, small morale
 * loss), ban (strength buff debuff for 3 rounds, morale gain) or
 * nothing (mass mutiny: morale and strength tank).
 *
 * 1-1 port of `@/game/events/jarasvuo.ts`. Skipped unless PHL.
 */
const jarasvuo: DeclarativeEvent<JarasvuoData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    if (!managerCompetesIn(manager, "phl")(ctx)) {
      return null;
    }
    return { eventId, manager, resolved: false };
  },

  options: () => ({
    fine: "Annan sakon.",
    ban: "Annan kolme ottelua kurinpidollista pelikieltoa.",
    nothing: "En tee mitään. Pojat ovat poikia!"
  }),

  resolve: (_ctx, data, value) => ({
    ...data,
    resolved: true,
    solution: value as JarasvuoData["solution"]
  }),

  render: (data) => {
    const lines = [
      `Huippupelaajanne on Sari Jarasvuon ohjelmassa haastattelussa. Hän ryöpyttää jostain syystä useita kanssapelaajiaan, valmentajaa ja koko organisaatiota. Kaikki saavat osansa.

Miten rankaiset pelaajaa?`
    ];
    if (!data.resolved) {
      return lines;
    }
    if (data.solution === "nothing") {
      lines.push(
        `Seuraus on KAPINA!!! Kaikki kaatuu päälle, johtokunta kokoontuu, pelaajat lopettavat protestina harjoittelun, fanit buuavat sinulle. Muutama pelaaja jopa lopettaa uransakin.`
      );
    }
    if (data.solution === "fine") {
      lines.push(`Pelaaja pyytää anteeksi.`);
    }
    if (data.solution === "ban") {
      lines.push(`Loistava tuomio, sanovat muut pelaajat.`);
    }
    return lines;
  },

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    const effects: EventEffect[] = [];
    if (data.solution === "nothing") {
      effects.push({ type: "decrementMorale", team, amount: 50 });
      effects.push({ type: "decrementStrength", team, amount: 18 });
    }
    if (data.solution === "fine") {
      effects.push({
        type: "incrementBalance",
        manager: data.manager,
        amount: 10000
      });
      effects.push({ type: "decrementMorale", team, amount: 3 });
    }
    if (data.solution === "ban") {
      effects.push({
        type: "addTeamEffect",
        team,
        effect: {
          parameter: ["strength"],
          amount: -15,
          duration: 3
        }
      });
      effects.push({ type: "incrementMorale", team, amount: 5 });
    }
    return effects;
  }
};

export default jarasvuo;
