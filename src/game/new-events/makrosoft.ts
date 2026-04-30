import { randomManager, randomTeamFrom } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "makrosoft";

export type MakrosoftData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  oldManager: string;
  newManager: string;
  team: number;
  teamName: string;
  strengthLoss: number;
};

/**
 * Makrosoft — pre-resolved. Random PHL team's sponsor goes
 * bankrupt. Strength −20.
 *
 * 1-1 port of `@/game/events/makrosoft.ts`.
 */
const makrosoft: DeclarativeEvent<MakrosoftData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const oldManager = randomManager()(ctx);
    const newManager = randomManager([oldManager.id])(ctx);
    const team = randomTeamFrom(["phl"], false, [])(ctx);
    return {
      eventId,
      manager,
      resolved: true,
      oldManager: oldManager.name,
      newManager: newManager.name,
      team: team.id,
      teamName: team.name,
      strengthLoss: 20
    };
  },

  render: (data) => [
    `${data.teamName}:n sponsori __Makrosoft__ on mennyt konkurssiin. Velkojat ovat joukkueen kimpussa, ja syntipukiksi leimataan manageri ${data.oldManager}. Hän saa potkut, ja tilalle palkataan ${data.newManager}.

Palkanmaksu viivästyy, ja muutama joukkueen pelaaja siirtyy ulkomaille.`
  ],

  process: (_ctx, data) => [
    { type: "incrementStrength", team: data.team, amount: -data.strengthLoss }
  ]
};

export default makrosoft;
