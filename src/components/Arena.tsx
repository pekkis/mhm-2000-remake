import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import ManagerInfo from "./ManagerInfo";
import Button from "./ui/Button";
import arenas from "@/data/arenas";
import clsx from "clsx";
import * as styles from "./Arena.css";
import { currency } from "@/services/format";
import Box from "./ui/Box";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { activeManager, canImproveArena } from "@/machines/selectors";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";

const Arenas = () => {
  const manager = useGameContext(activeManager);
  const canDo = useGameContext(canImproveArena(manager.id));
  const gameActor = GameMachineContext.useActorRef();

  const currentLevel = manager.arena.level;
  const nextLevel = arenas[currentLevel + 1];

  return (
    <AdvancedHeaderedPage
      escTo="/"
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Areena</Heading>

        <Stack gap="md">
          <Heading level={3}>Areenasi sijoitus areenahierarkiassa:</Heading>

          <Box>
            {arenas
              .map((arena, level) => {
                return (
                  <div
                    className={clsx(
                      styles.arenaRow,
                      level === currentLevel && styles.arenaRowCurrent
                    )}
                    key={arena.id}
                  >
                    {arena.name}
                  </div>
                );
              })
              .toReversed()}
          </Box>
        </Stack>

        <Box>
          {nextLevel && (
            <Button
              block
              disabled={!canDo}
              onClick={() =>
                gameActor.send({
                  type: "IMPROVE_ARENA",
                  payload: { manager: manager.id }
                })
              }
            >
              <Box>Paranna halliolosuhteitasi</Box>
              <Box>
                <strong>{currency(nextLevel.price)}</strong>
              </Box>
            </Button>
          )}
        </Box>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Arenas;
