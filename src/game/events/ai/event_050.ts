import type { DeclarativeEvent } from "@/types/event";

/*
CASE 119 TO 120
IF kiero2(kr) = 0 THEN
arpol 2, 1, 28
IF lukka = 0 THEN
luz 58
IF tarko(xx, 4, 20, 50) = 1 THEN
staulmaar
mor sijo(1, 12), -55
luz 79
ELSE
luz 80
END IF
END IF
END IF
*/

const eventId = "ai_event_050";

type EventFields = {};

export const event_050: DeclarativeEvent<EventFields, {}> = {
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
