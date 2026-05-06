import { managersTeamId, teamCompetesIn } from "@/machines/selectors";
import { currency as c } from "@/services/format";
import { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "russianAgent";

export type RussianAgentData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
  amount: number;
  agree?: boolean;
  /**
   * Mystery player's actual skill — `cinteger(1, 11)`. Rolled at
   * resolve time when the player accepts. Lives on the payload so
   * `process` is pure (and the value survives save/load).
   */
  skillGained?: number;
};

/**
 * Russian agent — interactive PHL-only event. The agent offers a
 * "top player" from CSKA Moscow at a fixed price; the player has to
 * decide blind. Skill is rolled at resolve time (only when accepting),
 * not in `process`.
 *
 * 1-1 port of `@/game/events/russian-agent.ts` (the second of two
 * events that rolled random in `process` — now baked into the
 * resolved payload).
 */
const russianAgent: DeclarativeEvent<RussianAgentData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const team = managersTeamId(manager)(ctx);
    if (!teamCompetesIn(team, "phl")(ctx)) {
      return null;
    }

    return {
      eventId,
      manager,
      amount: 50000,
      resolved: false
    };
  },

  options: () => ({
    agree: `Ostan mysteeripelaajan`,
    disagree: `En osta mysteeripelaajaa`
  }),

  resolve: (_ctx, data, value) => {
    const agree = value === "agree";
    if (!agree) {
      return { ...data, resolved: true, agree: false };
    }
    return {
      ...data,
      resolved: true,
      agree: true,
      skillGained: cinteger(1, 11)
    };
  },

  render: (data) => {
    const lines = [
      `Venäjän agenttisi soittaa ja tarjoaa "huippupelaajaa" __Moskovan ZSKA__:sta. Et tiedä mitään hänen tasostaan, mutta toisaalta hintakin on vain ${c(data.amount)}. Päätös täytyy joka tapauksessa tehdä _heti_.`
    ];

    if (!data.resolved) {
      return lines;
    }

    if (data.agree) {
      lines.push("Pelaaja saapuu seuraavalla vuorokoneella!");
    } else {
      lines.push("Pelaaja jää Moskovaan!");
    }
    return lines;
  },

  process: (ctx, data) => {
    if (!data.agree) {
      return [];
    }

    const team = managersTeamId(data.manager)(ctx);
    const effects: EventEffect[] = [
      {
        type: "incrementStrength",
        team,
        amount: data.skillGained ?? 0
      },
      {
        type: "decrementBalance",
        manager: data.manager,
        amount: data.amount
      }
    ];
    return effects;
  }
};

export default russianAgent;
