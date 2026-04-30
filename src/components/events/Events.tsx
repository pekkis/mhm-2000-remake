import { values } from "remeda";
import EventResolver from "./EventResolver";
import type { StoredEvent } from "@/state/event";
import Paragraph from "@/components/ui/Paragraph";
import Stack from "@/components/ui/Stack";

type EventsListProps = {
  events: Record<string, StoredEvent>;
  manager: { id: string };
  onAnswer: (event: StoredEvent, key: string) => void;
};

const Events = ({ events, manager, onAnswer }: EventsListProps) => {
  const managersEvents = values(events).filter((e) => e.manager === manager.id);

  return (
    <Stack>
      {managersEvents.length === 0 && <Paragraph>Ei tapahtumia.</Paragraph>}

      {managersEvents.map((e) => (
        <EventResolver key={e.id} event={e} onAnswer={onAnswer} />
      ))}
    </Stack>
  );
};

export default Events;
