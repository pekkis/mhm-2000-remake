import type { DeclarativeEvent } from "@/types/event";

/*
CASE 54 TO 60
arpo 2
IF tarko(xx, 6, 20, 50) = 0 THEN
taut .95, INT(5 * RND) + 2: luz 28
ELSE
taut 1.05, INT(6 * RND) + 3: luz 30
END IF
*/

const eventId = "ai_event_026";

type EventFields = {
  id: string;
  resolved: boolean;
  eventId: typeof eventId;
};

export const event_026: DeclarativeEvent<EventFields, { teamId: number }> = {
  lotteryBalls: 7,

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
