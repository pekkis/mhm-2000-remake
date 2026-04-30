import type { DeclarativeEvent } from "@/types/event";

const eventId = "cleandrug";

export type CleandrugData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
};

/**
 * Cleandrug — pre-resolved. Players passed the drug test. No effect.
 *
 * 1-1 port of `@/game/events/cleandrug.ts`.
 */
const cleandrug: DeclarativeEvent<CleandrugData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true
  }),

  render: () => [`Kaikki pelaajasi olivat puhtaita huumausainetesteissä.`],

  process: () => []
};

export default cleandrug;
