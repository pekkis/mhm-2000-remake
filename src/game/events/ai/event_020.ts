import type { DeclarativeEvent } from "@/types/event";

/*
CASE 39 TO 40
arpo 2
luz 21
taut .8, INT(10 * RND) + 2
mor xx, -55
IF tarko(xx, 5, 30, 0) = 0 THEN potk xx
*/

const eventId = "ai_event_020";

type EventFields = {};

export const event_020: DeclarativeEvent<EventFields, {}> = {
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
