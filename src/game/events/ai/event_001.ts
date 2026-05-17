import type { DeclarativeEvent } from "@/types/event";

/*
CASE 1 TO 6
arpo 2
IF tarko(xx, 1, 20, 50) = 1 THEN
luz 1
taut 1.1, INT(6 * RND) + 6
ELSE
luz 2
taut .9, INT(6 * RND) + 6
IF tarko(xx, 5, 20, 50) = 0 THEN potk xx
END IF
*/

const eventId = "event_001";

type EventFields = {
  id: string;
  resolved: boolean;
  eventId: typeof eventId;
};

export const event_001: DeclarativeEvent<EventFields, { teamId: number }> = {
  lotteryBalls: 6,

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
