import Button from "./ui/Button";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GameMachineContext } from "@/context/game-machine-context";
import { uiStore } from "@/stores/ui";
import { advanceEnabled as advanceEnabledSelector } from "@/machines/selectors";
import type { FC } from "react";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";

type Props = {
  back?: boolean;
  menu?: boolean;
  forward?: React.ReactNode;
};

const StickyMenu: FC<Props> = ({
  back = false,
  menu = false,
  forward = "Eteenpäin!"
}) => {
  const advanceEnabled = GameMachineContext.useSelector(advanceEnabledSelector);

  const game = GameMachineContext.useActorRef();

  const navigate = useNavigate();

  return (
    <Box p="md">
      <Stack direction="row">
        {back && (
          <Box flex="1">
            <Button
              block
              onClick={() => {
                navigate("/");
              }}
            >
              Päävalikkoon
            </Button>
          </Box>
        )}

        {!back && (
          <>
            {menu && (
              <div className="secondary">
                <Button
                  secondary
                  onClick={() => uiStore.send({ type: "toggleMenu" })}
                >
                  <FaBars />
                </Button>
              </div>
            )}
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
        )}
      </Stack>
    </Box>
  );
};

export default StickyMenu;
