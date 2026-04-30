import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";

import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import Paragraph from "./ui/Paragraph";
import { useGameContext } from "@/context/game-machine-context";
import Box from "@/components/ui/Box";

/*
IF tuurix(tux) > 15 THEN COLOR 13, 0: PRINT lw(tux); " pelasi koko turnauksen ajan todella suurella syd\"mell\"!": franko = franko + 1
IF tuurix(tux) < -15 THEN COLOR 5, 0: PRINT lw(tux); " k\"rsi koko turnauksen ajan suurista ongelmista!": franko = franko + 1
*/

const WorldChampionships = () => {
  const results = useGameContext((ctx) => ctx.worldChampionshipResults)!;
  const turn = useGameContext((ctx) => ctx.turn);

  return (
    <AdvancedHeaderedPage stickyMenu={<StickyMenu forward="Palkintogaala" />}>
      <Stack gap="lg">
        <Heading level={2}>Maailmanmestaruuskisat {turn.season + 1}</Heading>

        <Stack gap="sm">
          {results
            .filter((e) => e.luck > 0)
            .map((e) => (
              <Box key={e.id}>
                <strong>{e.name}</strong> pelasi koko turnauksen ajan todella
                suurella sydämellä!
              </Box>
            ))}
          {results
            .filter((e) => e.luck < 0)
            .map((e) => (
              <Box key={e.id}>
                <strong>{e.name}</strong> kärsi koko turnauksen ajan suurista
                ongelmista!
              </Box>
            ))}

          <ol>
            {results.map((entry) => (
              <li key={entry.id}>{entry.name}</li>
            ))}
          </ol>
        </Stack>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default WorldChampionships;
