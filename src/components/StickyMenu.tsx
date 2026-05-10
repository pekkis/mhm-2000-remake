import Button from "./ui/Button";
import { GameMachineContext } from "@/context/game-machine-context";
import { advanceEnabled as advanceEnabledSelector } from "@/machines/selectors";
import { useHotkeys } from "@mantine/hooks";
import type { FC } from "react";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";

type Props = {
  back?: boolean;
  menu?: boolean;
  forward?: React.ReactNode;
  onAdvance?: () => void;
};

const StickyMenu: FC<Props> = ({ forward = "Eteenpäin!", onAdvance }) => {
  const advanceEnabled = GameMachineContext.useSelector(advanceEnabledSelector);

  const game = GameMachineContext.useActorRef();

  const handleAdvance = () => {
    if (!advanceEnabled) {
      return;
    }
    if (onAdvance) {
      onAdvance();
    } else {
      game.send({ type: "ADVANCE" });
    }
  };

  useHotkeys([["Enter", handleAdvance]]);

  return (
    <Box p="md">
      <Stack direction="row">
        <>
          <Box flex="1">
            <Button block disabled={!advanceEnabled} onClick={handleAdvance}>
              {forward}
            </Button>
          </Box>
        </>
      </Stack>
    </Box>
  );
};

export default StickyMenu;
