import type { DeclarativeEvent } from "@/types/event";

/*
CASE 76
arpo 1
IF tarko(xx, 6, 20, 50) = 0 THEN
luz 37
potk xx
mor xx, -5
ELSE
luz 70
IF tarko(xx, 5, 20, 50) = 0 THEN luz 71: potk xx
END IF
*/

const eventId = "ai_event_035";

type EventFields = {
  id: string;
  resolved: boolean;
  eventId: typeof eventId;
};

export const event_035: DeclarativeEvent<EventFields, { teamId: number }> = {
  lotteryBalls: 1,

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
