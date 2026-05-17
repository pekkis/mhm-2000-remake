import { event_001 } from "@/game/events/ai/event_001";
import type { DeclarativeEvent, EventResolutionMeta } from "@/types/event";

const events: DeclarativeEvent<any, any>[] = [event_001];

type EventRegistryData = {
  lotteryBalls: number;
  event: DeclarativeEvent<any, any>;
};

type EventRegistry = Record<string, EventRegistryData>;

export const resolvedEvent = <T extends {}>(
  eventData: T
): [EventResolutionMeta, T] => {
  return [
    {
      resolved: true
    },
    eventData
  ];
};

const createEventRegistry = (events: DeclarativeEvent<any, any>[]) => {
  const eventRegistry: EventRegistry = Object.fromEntries(
    events.map((event) => {
      const meta = event.register();

      return [
        meta.eventId,
        {
          lotteryBalls: meta.lotteryBalls,
          event
        }
      ];
    })
  );

  return eventRegistry;
};

export const eventRegistry = createEventRegistry(events);
