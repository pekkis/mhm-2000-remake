import type { DeclarativeEvent } from "@/types/event";

/*
CASE 77 TO 80
arpo 1
luz 38
IF tarko(xx, 6, 20, 50) = 1 OR tautip(xx) <> 1 THEN
luz 72
ELSE
gnome = INT(4 * RND) + 1
taut .9, gnome
luz 73
END IF
*/

const eventId = "ai_event_036";

type EventFields = {
  id: string;
  resolved: boolean;
  eventId: typeof eventId;
};

export const event_036: DeclarativeEvent<EventFields, { teamId: number }> = {
  lotteryBalls: 4,

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
