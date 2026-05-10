import { Bracket } from "@/components/playoffs/Bracket";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";

import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import { useGameContext } from "@/context/game-machine-context";

const PlayoffBracket = () => {
  const competition = useGameContext((ctx) => ctx.competitions.phl);
  const teams = useGameContext((ctx) => ctx.teams);

  return (
    <AdvancedHeaderedPage escTo="/" stickyMenu={<StickyMenu back />}>
      <Stack gap="lg">
        <Heading level={2}>Playoffit</Heading>

        <Stack gap="md">
          <Bracket competition={competition} teams={teams} />
        </Stack>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default PlayoffBracket;
