import type { DeclarativeEvent } from "@/types/event";

const eventId = "grossman";

export type GrossmanData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: boolean;
};

/**
 * Grossman — interactive but cosmetic. Player picks an answer; no
 * effects either way (saga's `process` is empty).
 *
 * 1-1 port of `@/game/events/grossman.ts`.
 */
const grossman: DeclarativeEvent<GrossmanData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: false
  }),

  options: () => ({
    agree: `Ei, kiitos!`,
    disagree: `Kiitos, ei!`
  }),

  resolve: (_ctx, data) => ({ ...data, resolved: true }),

  render: (data) => {
    const lines = [
      `Urheilun tappaja, pienten seurojen kirous, kuuluisan Grossman-päätöksen aikaansaaja, __Marc Grossman__, haluaisi pelata joukkueessasi. Otatko kaikkialla vihatun Grossmanin joukkueeseesi?`
    ];
    if (!data.resolved) {
      return lines;
    }
    lines.push(
      `__Grossman__ pillahtaa itkuun. Hänen uransa on tuhottu, vaikka hän tarkoitti vain hyvää.`
    );
    return lines;
  },

  process: () => []
};

export default grossman;
