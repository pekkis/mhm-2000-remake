import type { DeclarativeEvent } from "@/types/event";

/*
CASE 30 TO 31
arpo 2
IF tarko(xx, 6, 20, 50) = 0 THEN taut .85, INT(6 * RND) + 5: mor xx, -10: luz 16
*/

const eventId = "ai_event_015";

type EventFields = {
  id: string;
  resolved: boolean;
  eventId: typeof eventId;
};

export const event_015: DeclarativeEvent<EventFields, { teamId: number }> = {
  lotteryBalls: 2,

  type: "team",

  create: (_context, _params) => {
    return null;
  },

  process: () => {
    return [];
  },

  render: () => {
    return [];
  }
};
