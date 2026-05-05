import type { DeclarativeEvent } from "@/types/event";
import type { PrankInstance } from "@/game/pranks";
import type { EventEffect } from "@/game/event-effects";
import random, { cinteger } from "@/services/random";
import { teamCompetesIn } from "@/machines/selectors";
import { currency } from "@/services/format";

const eventId = "sellNarcotics";

export type SellNarcoticsData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  victim: number;
  resolved: boolean;
  /** Rolled in resolve. */
  skillLost?: number;
  /** Rolled in resolve. */
  fine?: number;
  /** Snapshotted at resolve time. */
  victimTeamName?: string;
  /** Rolled in resolve. */
  caught?: boolean;
};

/**
 * Sell-narcotics — prank-spawned auto-resolve event. The victim's
 * star player overdoses. PHL victims lose more skill but cost more
 * to bribe out of; division victims lose less but cheaper bribe. The
 * `caught` roll (70% chance) decides whether the manager pays a
 * fine.
 *
 * 1-1 port of `@/game/events/sell-narcotics.ts`. Spawned by the
 * `playerHooking` prank.
 */
const sellNarcotics: DeclarativeEvent<SellNarcoticsData, PrankInstance> = {
  type: "manager",

  create: (_ctx, { manager, victim }) => ({
    eventId,
    manager,
    victim,
    resolved: false
  }),

  // No `options` — auto-resolves on event-phase entry.
  resolve: (ctx, data) => {
    const victimTeam = ctx.teams[data.victim];
    const phl = teamCompetesIn(data.victim, "phl")(ctx);
    const skillLost = phl ? cinteger(0, 25) + 1 : cinteger(0, 12) + 1;
    const fine = phl ? 200000 : 60000;
    return {
      ...data,
      resolved: true,
      skillLost,
      fine,
      victimTeamName: victimTeam.name,
      caught: random.bool(0.7)
    };
  },

  render: (data) => {
    const lines = [
      `Voi ei! __${data.victimTeamName}__ on kohdannut suuren tragedian. Joukkueen tähtipelaaja on löytynyt kotoaan kuolleena. Miliisi ei tiedota tapahtumista, mutta huhut väittävät syyksi tuntemattoman muuntohuumeen yliannostusta.`
    ];
    if (data.caught) {
      lines.push(
        `Vaikka miliisi ei julkisesti tapahtumista puhukaan, sinulle he kyllä soittavat. On tapahtunut "pikku kämmi", ja tarvitaan lisävoitelua. Joudut pulittamaan ylimääräiset __${currency(data.fine!)}__. Ystäväsi Jaarnio pahoittelee suuresti.`
      );
    }
    return lines;
  },

  process: (_ctx, data) => {
    const effects: EventEffect[] = [
      { type: "decrementStrength", team: data.victim, amount: data.skillLost! }
    ];
    if (data.caught) {
      effects.push({
        type: "decrementBalance",
        manager: data.manager,
        amount: data.fine!
      });
    }
    return effects;
  }
};

export default sellNarcotics;
