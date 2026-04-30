import { managersDifficulty } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "undqvist";

export type UndqvistData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
};

/**
 * Undqvist — pre-resolved. Bank failure: balance reset to 0.
 * Skipped on difficulty 4 (saga's `IF banki = 1 THEN RETURN`
 * mapped to "no insurance against bank failure" — original code
 * gated on `difficulty === 4`).
 *
 * 1-1 port of `@/game/events/undqvist.ts`.
 */
const undqvist: DeclarativeEvent<UndqvistData> = {
  type: "manager",

  create: (ctx, { manager }) => {
    const difficulty = managersDifficulty(manager)(ctx);
    if (difficulty === 4) {
      return null;
    }
    return {
      eventId,
      manager,
      resolved: true
    };
  },

  render: () => [
    `Pankki, jossa joukkueen tili (tai velka) on, __menee konkurssiin__! Kaikki pankissa uinuvat säästöt, velat ja sijoitukset ovat ikuisiksi ajoiksi mennyttä. Kansa vaatii rahojaan takaisin, mutta turhaan.

Pankinjohtaja Sulf Undqvist valittelee tapahtunutta ja matkustaa toipumaan Gaymansaarten huvilalleen.`
  ],

  process: (_ctx, data) => [
    { type: "setBalance", manager: data.manager, amount: 0 }
  ]
};

export default undqvist;
