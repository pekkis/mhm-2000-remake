import { managersTeamId } from "@/machines/selectors";
import type { DeclarativeEvent } from "@/types/event";

const eventId = "karijurri";

export type KarijurriData = {
  id: string;
  eventId: typeof eventId;
  manager: string;
  resolved: true;
  strength: number;
  duration: number;
};

/**
 * Karijurri — pre-resolved. NHL strike sends Kari Jurri home for
 * 6 games: +15 strength for the duration.
 *
 * 1-1 port of `@/game/events/karijurri.ts`.
 */
const karijurri: DeclarativeEvent<KarijurriData> = {
  type: "manager",

  create: (_ctx, { manager }) => ({
    eventId,
    manager,
    resolved: true,
    strength: 15,
    duration: 6
  }),

  render: (data) => [
    `NHL on lakossa ${data.duration} ottelun ajan, ja __Kari Jurri__ saapuu Denveristä, Coloradosta, joukkueeseesi pitämään kuntoaan yllä!`
  ],

  process: (ctx, data) => {
    const team = managersTeamId(data.manager)(ctx);
    return [
      {
        type: "addTeamEffect",
        team,
        effect: {
          parameter: ["strength"],
          amount: data.strength,
          duration: data.duration
        }
      }
    ];
  }
};

export default karijurri;
