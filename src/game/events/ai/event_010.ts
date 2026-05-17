import type { DeclarativeEvent } from "@/types/event";

/*
CASE 20 TO 21
IF kr > 13 AND kiero2(kr) = 1 THEN
arpol 1, 4, 11
IF lukka = 0 THEN
IF tarko(xx, 3, 30, 20) = 0 THEN
yy = xx
arpol 2, 3, 3
IF lukka = 0 THEN
IF tarko(xx, 3, 30, 20) = 1 THEN
luz 11
potk yy
IF mw(xx) < mw(yy) THEN
mw(xx) = mw(yy): mw(yy) = mw(yy) - (INT(2 * RND) + 1)
END IF
xxx = INT(4 * RND) + 3
pw(xx) = pw(xx) + xxx
pw(yy) = pw(yy) - xxx
xxx = INT(7 * RND) + 4
hw(xx) = hw(xx) + xxx
hw(yy) = hw(yy) - xxx
END IF
END IF
END IF
END IF
END IF
*/

const eventId = "ai_event_010";

type EventFields = {};

export const event_010: DeclarativeEvent<EventFields, {}> = {
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
