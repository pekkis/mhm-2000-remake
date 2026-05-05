import {
  managerById,
  managersTeamId,
  totalGamesPlayed
} from "@/machines/selectors";
import random, { cinteger } from "@/services/random";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "book";

const bookNames: ((data: BookData) => string)[] = [
  (data) => `${data.managerName}: legenda jo eläessään`,
  () => `Mestarimanagerin tarina`,
  () => `Managerikukkulan kuningas`,
  () => `Kapina hallilla`
];

export type BookData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  managerName: string;
  book: number;
};

/**
 * Book — pre-resolved. Skipped on PHL games <400. Morale +2.
 *
 * 1-1 port of `@/game/events/book.ts`.
 */
const book: DeclarativeEvent<BookData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const phlGamesPlayed = totalGamesPlayed(manager, "phl", 0)(ctx);
    if (!phlGamesPlayed || phlGamesPlayed < 400) {
      return null;
    }
    const m = managerById(manager)(ctx);
    if (!m) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true,
      managerName: m.name,
      book: cinteger(0, 3)
    };
  },

  render: (data) => [
    `Kuuluisa kirjailija __Seppo Kuningas__ hahmottelee uutta teosta. "${bookNames[data.book](data)}" on kirjan nimi, ja se kertoo sinun elämästäsi!`
  ],

  process: (ctx, data) => [
    {
      type: "incrementMorale",
      team: managersTeamId(data.manager)(ctx),
      amount: 2
    }
  ]
};

export default book;
