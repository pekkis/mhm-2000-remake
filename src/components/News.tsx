import Announcements from "./events/Announcements";
import ManagerInfo from "./ManagerInfo";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import { useGameContext } from "@/context/game-machine-context";
import { activeManager } from "@/machines/selectors";
import EventsList from "./events/Events";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";

const News = () => {
  const manager = useGameContext(activeManager);
  const announcements = useGameContext((ctx) => ctx.news.announcements);
  const events = useGameContext((ctx) => ctx.event.events);

  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Tapahtumat</Heading>

        <Stack gap="md">
          <EventsList
            manager={manager}
            events={events}
            onAnswer={() => undefined}
          />
        </Stack>
        <Announcements
          announcements={announcements[manager.id.toString()] || []}
        />
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default News;
