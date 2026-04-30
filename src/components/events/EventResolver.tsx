import type { FC } from "react";
import { entries } from "remeda";
import Markdown from "@/components/Markdown";
import Button from "@/components/ui/Button";
import Stack from "@/components/ui/Stack";
import newEvents from "@/game/new-events";
import Box from "@/components/ui/Box";
import type { StoredEvent } from "@/state/event";
import type { DeclarativeEvent } from "@/types/event";
import type { BaseEventFields } from "@/types/base";

// The registry is `as const` for nice per-event typing at definition
// sites, but at the call site we look up by a runtime id, so we widen
// to a string-keyed lookup of the loosest declarative-event shape.
type AnyEvent = DeclarativeEvent<BaseEventFields & Record<string, unknown>>;
const eventRegistry = newEvents as unknown as Record<
  string,
  AnyEvent | undefined
>;

type EventResolverProps = {
  event: StoredEvent;
  onAnswer: (event: StoredEvent, key: string) => void;
};

const EventResolver: FC<EventResolverProps> = ({ event, onAnswer }) => {
  const definition = eventRegistry[event.eventId];

  if (!definition) {
    // The machine refuses to spawn events whose definitions aren't in
    // the registry, so reaching here means the registry and the
    // running game are out of sync — most likely a save from a build
    // that knew about an event id this build doesn't. Loud is better
    // than silently rendering nothing.
    throw new Error(`Unknown event id: ${event.eventId}`);
  }

  return (
    <Box>
      <Markdown>
        {definition
          .render(event)
          .filter((t) => t)
          .join("\n\n")}
      </Markdown>
      {!event.resolved && definition.options && (
        <Stack>
          {entries(definition.options(event)).map(([key, option]) => (
            <Button key={key} block onClick={() => onAnswer(event, key)}>
              {option}
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default EventResolver;
