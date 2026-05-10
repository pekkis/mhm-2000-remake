import News from "./news/News";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import Season from "./data/Season";
import Announcements from "./events/Announcements";

import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import { useGameContext } from "@/context/game-machine-context";
import { activeManager } from "@/machines/selectors";

const EndOfSeason = () => {
  const manager = useGameContext(activeManager);
  const news = useGameContext((ctx) => ctx.news.news);
  const turn = useGameContext((ctx) => ctx.turn);
  const announcements = useGameContext((ctx) => ctx.news.announcements);

  return (
    <AdvancedHeaderedPage stickyMenu={<StickyMenu forward="Seuraava kausi" />}>
      <Stack gap="lg">
        <Heading level={2}>
          Kausi <Season long index={turn.season} />
        </Heading>

        <Stack>
          <Announcements
            announcements={announcements[manager.id.toString()] || []}
          />

          <News manager={manager} news={news} />
        </Stack>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default EndOfSeason;
