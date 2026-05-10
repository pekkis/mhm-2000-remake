import News from "./news/News";
import StickyMenu from "./StickyMenu";
import PageLayout from "@/components/page/PageLayout";

import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import { useGameContext } from "@/context/game-machine-context";

const Gala = () => {
  const news = useGameContext((ctx) => ctx.news.news);

  return (
    <PageLayout
      stickyMenu={<StickyMenu forward="Jo riittää lätinä, asiaan!" />}
    >
      <Stack gap="lg">
        <Heading level={2}>Loppuottelugaala</Heading>

        <News news={news} />
      </Stack>
    </PageLayout>
  );
};

export default Gala;
