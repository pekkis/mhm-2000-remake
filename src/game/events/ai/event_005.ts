import type { DeclarativeEvent } from "@/types/event";

/*
CASE 12 TO 13
arpol 1, 1, 33
IF lukka = 0 AND tautip(xx) = 1 THEN
IF tarko(xx, 4, 20, 50) = 0 THEN
taut .9, INT(7 * RND) + 4: mor xx, -10: luz 6
IF tarko(xx, 5, 20, 50) = 0 THEN potk xx
END IF
END IF
*/

const eventId = "ai_event_005";

type EventFields = {};

export const event_005: DeclarativeEvent<EventFields, {}> = {
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
