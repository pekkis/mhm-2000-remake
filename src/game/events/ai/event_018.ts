import type { DeclarativeEvent } from "@/types/event";

/*
CASE 36 TO 37
IF kiero2(kr) = 1 THEN
arpol 1, 1, 26
IF lukka = 0 AND tarko(xx, 4, 20, 50) = 0 THEN pw(xx) = pw(xx) - INT(2 * RND) - 2: luz 19
END IF
*/

const eventId = "ai_event_018";

type EventFields = {};

export const event_018: DeclarativeEvent<EventFields, {}> = {
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
