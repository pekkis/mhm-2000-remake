import { managersDifficulty, managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "pertinPselit";

type PseliKind = "good" | "bad";

const pselit: Record<PseliKind, { text: string; moraleChange: number }> = {
  good: {
    text: `Pseli menee todella pserseelleen, mutta lastensairaala saa joka tapauksessa rahaa. Moraali nousee hyväntekeväisyystempauksen johdosta.`,
    moraleChange: 4
  },
  bad: {
    text: `Pseli menee todella pserseelleen, ja kun Pertti vielä pimittää kaikki rahat ja lehdistökin repostelee jutulla, moraali laskee.`,
    moraleChange: -4
  }
};

export type PertinPselitData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  pseli: PseliKind;
};

/**
 * Pertin Pselit — pre-resolved. Charity event. Morale +4 normally;
 * −4 on difficulty 4 (Pertti pockets the cash).
 *
 * 1-1 port of `@/game/events/pertin-pselit.ts`.
 */
const pertinPselit: DeclarativeEvent<PertinPselitData> = {
  type: "manager",

  create: (ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    pseli: managersDifficulty(manager)(ctx) < 4 ? "good" : "bad"
  }),

  render: (data) => [
    `__Pertin Pselit__ kutsuu sinut pselailemaan!`,
    pselit[data.pseli].text
  ],

  process: (ctx, data) => [
    {
      type: "incrementMorale",
      team: managersTeamId(data.manager)(ctx),
      amount: pselit[data.pseli].moraleChange
    }
  ]
};

export default pertinPselit;
