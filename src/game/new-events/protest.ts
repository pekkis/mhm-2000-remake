import type { DeclarativeEvent } from "@/types/event";
import type { PrankInstance } from "@/game/pranks";
import random from "@/services/random";
import { managersTeam } from "@/machines/selectors";
import { entries } from "remeda";

const eventId = "protest";

export type ProtestData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  victim: number;
  resolved: boolean;
  /** Snapshotted at resolve. */
  perpetrator?: number;
  /** Snapshotted at resolve. */
  perpetratorTeamName?: string;
  /** Snapshotted at resolve. */
  victimTeamName?: string;
  /** Rolled in resolve. */
  success?: boolean;
  /** Constant — kept on payload to match saga shape. */
  penalty?: number;
};

/**
 * Protest — prank-spawned auto-resolve event. The hockey league
 * board "deliberates" the protest filed by the perpetrator against
 * the victim. Coin flip decides who eats the 3-point penalty.
 *
 * 1-1 port of `@/game/events/protest.ts`. Spawned by the `protest`
 * prank.
 */
const protest: DeclarativeEvent<ProtestData, PrankInstance> = {
  type: "manager",

  create: (_ctx, { manager, victim }) => ({
    eventId,
    manager,
    victim,
    resolved: false
  }),

  // No `options` — auto-resolves on event-phase entry.
  resolve: (ctx, data) => {
    const perpetratorTeam = managersTeam(data.manager)(ctx);
    const victimTeam = ctx.teams[data.victim];
    return {
      ...data,
      resolved: true,
      perpetrator: perpetratorTeam.id,
      perpetratorTeamName: perpetratorTeam.name,
      victimTeamName: victimTeam.name,
      success: random.bool(),
      penalty: -3
    };
  },

  render: (data) => {
    const lines = [
      `Jääkiekkoliiton hallitus on juhlallisesti ynnä virallisesti kokoontunut ja käsitellyt protestisi mitä reiluimmassa ja tasapuolisimmassa hengessä. Päätös on lopullinen, eikä siitä voi valittaa.`
    ];
    if (data.success) {
      lines.push(
        `Argumenttisi todetaan päteviksi. __${data.victimTeamName}__ tuomitaan menettämään ${Math.abs(data.penalty!)} pistettä rangaistuksena väitetystä sääntörikkomuksesta.`
      );
    } else {
      lines.push(
        `Argumenttisi todetaan hölynpölyksi. __${data.perpetratorTeamName}__ tuomitaan menettämään ${Math.abs(data.penalty!)} pistettä rangaistuksena aiheettomasta syytöksestä.`
      );
    }
    return lines;
  },

  process: (ctx, data) => {
    const penalizedTeam = data.success ? data.victim : data.perpetrator!;
    // Find the (non-EHL) competition + group containing the penalized team.
    // Penalties only live on round-robin groups in phase 0.
    const found = entries(ctx.competitions)
      .filter(([id]) => id !== "ehl")
      .find(([, c]) => c.teams.includes(penalizedTeam));
    if (!found) {
      return [];
    }
    const [competitionId, competition] = found;
    const groupIdx = competition.phases[0].groups.findIndex((g) =>
      g.teams.includes(penalizedTeam)
    );
    if (groupIdx === -1) {
      return [];
    }
    return [
      {
        type: "incurPenalty",
        competition: competitionId,
        phase: 0,
        group: groupIdx,
        team: penalizedTeam,
        penalty: data.penalty!
      }
    ];
  }
};

export default protest;
