import Stack from "@/components/ui/Stack";
import EventsList from "./events/Events";
import ManagerInfo from "./ManagerInfo";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { activeManager } from "@/machines/selectors";
import Heading from "@/components/ui/Heading";

const Events = () => {
  const game = GameMachineContext.useActorRef();
  const manager = useGameContext(activeManager);
  const events = useGameContext((ctx) => ctx.event.events);

  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Tapahtumat</Heading>

        <EventsList
          manager={manager}
          events={events}
          onAnswer={(e, key) =>
            game.send({
              type: "RESOLVE_EVENT",
              payload: { id: e.id, value: key }
            })
          }
        />
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Events;
