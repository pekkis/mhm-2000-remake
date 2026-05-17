import type { DeclarativeEvent } from "@/types/event";

/*
CASE 34 TO 35
IF kiero2(kr) = 1 THEN
arpol 1, 1, 26
IF lukka = 0 AND tarko(xx, 4, 20, 50) = 0 THEN hw(xx) = hw(xx) - INT(3 * RND) - 2: luz 18
END IF
*/

const eventId = "ai_event_017";

type EventFields = {};

export const event_017: DeclarativeEvent<EventFields, {}> = {
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
