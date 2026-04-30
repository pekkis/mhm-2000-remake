import { managersArena, randomManager } from "@/machines/selectors";
import { amount as a } from "@/services/format";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "scoreboard";

export type ScoreboardData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  otherManager: string;
  amount: number;
};

/**
 * Scoreboard sabotage — pre-resolved. Skipped on arenas of level
 * <5. Repair bill: 250 000 pekka.
 *
 * 1-1 port of `@/game/events/scoreboard.ts`.
 */
const scoreboard: DeclarativeEvent<ScoreboardData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const arena = managersArena(manager)(ctx);
    if (!arena || arena.level < 5) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true,
      otherManager: randomManager()(ctx).name,
      amount: 250000
    };
  },

  render: (data) => [
    `Hallisi tulostaulu on pudonnut keskellä yötä! Eräs pelaajasi löytää mustan kommandopipon pukuhuoneen roskiksesta, mutta tekijää ei saada kiinni.

Manageri __${data.otherManager}__ soittaa ja valittelee tapahtunutta. Korjauskustannukset nousevat ${a(data.amount)} pekkaan!`
  ],

  process: (_ctx, data) => [
    { type: "decrementBalance", manager: data.manager, amount: data.amount }
  ]
};

export default scoreboard;
