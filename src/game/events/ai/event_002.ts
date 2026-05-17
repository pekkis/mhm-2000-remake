import type { DeclarativeEvent } from "@/types/event";

/*
CASE 7 TO 8
arpo 1
IF tarka(3) = 0 AND tarko(xx, 6, 20, 50) = 0 THEN
luz 3
teet 3, -10, INT(5 * RND) + 3
END IF
*/

const eventId = "ai_event_002";

type EventFields = {};

export const event_002: DeclarativeEvent<EventFields, { teamId: number }> = {
  register: () => {
    return {
      eventId,
      lotteryBalls: 2
    };
  },

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
