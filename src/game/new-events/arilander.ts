import {
  managersDifficulty,
  managersTeamId,
  randomTeamFrom
} from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "arilander";

export type ArilanderData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  moraleLoss: number;
  randomTeam: string;
};

/**
 * Arilander — pre-resolved. Skipped on difficulty <2. Morale loss
 * 16 on difficulty >2, otherwise 10.
 *
 * 1-1 port of `@/game/events/arilander.ts`.
 */
const arilander: DeclarativeEvent<ArilanderData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const difficulty = managersDifficulty(manager)(ctx);
    if (difficulty < 2) {
      return null;
    }
    const t = randomTeamFrom(["phl", "division"], false, [])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      moraleLoss: difficulty > 2 ? 16 : 10,
      randomTeam: t.name
    };
  },

  render: (data) => [
    `__Sulo Arilander__ ${data.randomTeam}:sta väittää joutuneensa hyväksikäytetyksi juniorivuosinaan pelattuaan valmentamassasi joukkueessa, Jukureissa. Jotkut pelaajista alkavat hieman "vieroksua" sinua, ja päätäsi vaaditaan vadille!

Saat kuitenkin pitää paikkasi, koska todisteita ei ole.`
  ],

  process: (ctx, data) => [
    {
      type: "incrementMorale",
      team: managersTeamId(data.manager)(ctx),
      amount: -data.moraleLoss
    }
  ]
};

export default arilander;
