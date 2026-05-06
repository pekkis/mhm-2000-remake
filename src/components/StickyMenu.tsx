import Button from "./ui/Button";
import { GameMachineContext } from "@/context/game-machine-context";
import { advanceEnabled as advanceEnabledSelector } from "@/machines/selectors";
import type { FC } from "react";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";

type Props = {
  back?: boolean;
  menu?: boolean;
  forward?: React.ReactNode;
};

const StickyMenu: FC<Props> = ({ forward = "Eteenpäin!" }) => {
  const advanceEnabled = GameMachineContext.useSelector(advanceEnabledSelector);

  const game = GameMachineContext.useActorRef();

  return (
    <Box p="md">
      <Stack direction="row">
        <>
          <Box flex="1">
            <Button
              block
              disabled={!advanceEnabled}
              onClick={() => {
                game.send({ type: "ADVANCE" });
              }}
            >
              {forward}
            </Button>
          </Box>
        </>
      </Stack>
    </Box>
  );
};

export default StickyMenu;
