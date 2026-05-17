import type { DeclarativeEvent } from "@/types/event";

/*
CASE 26 TO 27
arpol 1, 1, 30
IF lukka = 0 AND tarko(xx, 6, 20, 50) = 0 THEN pw(xx) = pw(xx) - INT(3 * RND) - 1: luz 14
*/

const eventId = "ai_event_013";

type EventFields = {
  id: string;
  resolved: boolean;
  eventId: typeof eventId;
};

export const event_013: DeclarativeEvent<EventFields, { teamId: number }> = {
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
