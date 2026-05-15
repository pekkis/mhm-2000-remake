import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import { useGameContext } from "@/context/game-machine-context";
import { activeManager, managersTeam } from "@/machines/selectors";
import type { HumanTeam } from "@/state/game";
import StickyMenu from "./StickyMenu";
import Box from "@/components/ui/Box";
import { values } from "remeda";
import * as faces from "facesjs";
import { Face } from "facesjs/react";

const POCMenu = () => {
  const manager = useGameContext(activeManager);
  const team = useGameContext(managersTeam(manager.id)) as HumanTeam;

  const larvi = faces.generate(
    {
      jersey: { id: "hockey" }
    },
    {
      gender: "male"
    }
  );

  console.log("larvi", larvi);

  const players = team.players;

  return (
    <AdvancedHeaderedPage escTo="/" stickyMenu={<StickyMenu back />}>
      <Stack gap="lg">
        <Heading level={2}>Faces</Heading>

        <Stack gap="sm">
          {values(players).map((player) => {
            return (
              <Box key={player.id}>
                <Box>
                  <Face face={larvi} />
                  {player.surname}, {player.initial}
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default POCMenu;
