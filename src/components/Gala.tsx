import News from "./news/News";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";

import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import { useGameContext } from "@/context/game-machine-context";

const Gala = () => {
  const news = useGameContext((ctx) => ctx.news.news);

  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu forward="Jo riittää lätinä, asiaan!" />}
    >
      <Stack gap="lg">
        <Heading level={2}>Loppuottelugaala</Heading>

        <News news={news} />
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Gala;
