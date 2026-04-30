import { randomManager, randomTeamFrom } from "@/machines/selectors";
import random from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "bloodbath";

export type BloodbathData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  otherManager: string;
  otherManager2: string;
  team: number;
  team2: number;
  teamName: string;
  teamName2: string;
  /** Skill loss for `team`. Rolled at creation time. */
  team1StrengthLoss: number;
  /** Skill loss for `team2`. Rolled at creation time. */
  team2StrengthLoss: number;
};

/**
 * Bloodbath — auto-resolve. Two PHL teams' players take to murderous
 * lengths against each other; both lose strength. The two strength
 * loss rolls (`cinteger(0, 12) + 6`) move from `process` to `create`,
 * baked into the payload so `process` is fully deterministic.
 *
 * 1-1 port of `@/game/events/bloodbath.ts` (one of two events in the
 * codebase that actually rolled random in `process`).
 */
const bloodbath: DeclarativeEvent<BloodbathData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const r1 = randomManager()(ctx);
    const r2 = randomManager([r1.id])(ctx);
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    const team2 = randomTeamFrom(["phl"], false, [team.id])(ctx);

    return {
      eventId,
      manager,
      otherManager: r1.name,
      otherManager2: r2.name,
      team: team.id,
      team2: team2.id,
      teamName: team.name,
      teamName2: team2.name,
      team1StrengthLoss: random.cinteger(0, 12) + 6,
      team2StrengthLoss: random.cinteger(0, 12) + 6,
      resolved: true
    };
  },

  render: (data) => [
    `__${data.teamName}__:n ja __${data.teamName2}__:n pelaajat ovat ottaneet väkivaltaisesti yhteen! Miliisi löytää tappelupaikalta yhden molempien joukkueiden pelaajista kuolleena sekä verisen pensasleikkurin.

Muita asianomaisia ei koskaan saada kiinni. Kaikki kiistävät osallisuutensa, managerit __${data.otherManager}__ ja __${data.otherManager2}__ mukaanlukien."`
  ],

  process: (_ctx, data) => [
    {
      type: "decrementStrength",
      team: data.team,
      amount: data.team1StrengthLoss
    },
    {
      type: "decrementStrength",
      team: data.team2,
      amount: data.team2StrengthLoss
    }
  ]
};

export default bloodbath;
