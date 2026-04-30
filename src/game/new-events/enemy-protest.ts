import {
  managerCompetesIn,
  managersDifficulty,
  managersTeam,
  randomManager,
  randomTeamFrom
} from "@/machines/selectors";
import type { CompetitionId } from "@/types/competitions";
import { entries } from "remeda";
import type { DeclarativeEvent } from "@/types/event";
import type { EventEffect } from "@/game/event-effects";

const eventId = "enemyProtest";

export type EnemyProtestData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  otherManagerName: string;
  otherTeam: number;
  otherTeamName: string;
  penalty: number;
  reward: number;
  team: number;
};

/**
 * Enemy protest — pre-resolved. Random other manager protests
 * against you. You lose 2 points (4 on difficulty 4); they gain 2.
 *
 * 1-1 port of `@/game/events/enemy-protest.ts`.
 */
const enemyProtest: DeclarativeEvent<EnemyProtestData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const difficulty = managersDifficulty(manager)(ctx);
    const otherManager = randomManager()(ctx);
    const competesInPHL = managerCompetesIn(manager, "phl")(ctx);
    const otherTeam = randomTeamFrom(
      [competesInPHL ? "phl" : "division"],
      false,
      []
    )(ctx);
    const team = managersTeam(manager)(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      otherManagerName: otherManager.name,
      otherTeam: otherTeam.id,
      otherTeamName: otherTeam.name,
      penalty: difficulty === 4 ? -4 : -2,
      reward: 2,
      team: team.id
    };
  },

  render: (data) => [
    `Manageri __${data.otherManagerName}__ ja joukkueensa __${data.otherTeamName}__ tekevät protestin joukkuettasi vastaan.

Protesti menee läpi, ja teiltä vähennetään ${Math.abs(data.penalty)} pistettä. ${data.otherTeamName} saa ${Math.abs(data.reward)} lisäpistettä.`
  ],

  process: (ctx, data) => {
    const found = entries(ctx.competitions)
      .filter(([id]) => id !== "ehl")
      .find(([, c]) => c.teams.includes(data.team));
    if (!found) {
      return [];
    }
    const [competitionId, competition] = found;
    const groupIdx = competition.phases[0].groups.findIndex((g) =>
      g.teams.includes(data.team)
    );
    if (groupIdx === -1) {
      return [];
    }
    const effects: EventEffect[] = [
      {
        type: "incurPenalty",
        competition: competitionId as CompetitionId,
        phase: 0,
        group: groupIdx,
        team: data.team,
        penalty: data.penalty
      },
      {
        type: "incurPenalty",
        competition: competitionId as CompetitionId,
        phase: 0,
        group: groupIdx,
        team: data.otherTeam,
        penalty: data.reward
      }
    ];
    return effects;
  }
};

export default enemyProtest;
