import type { FC } from "react";
import ManagerInfo from "./ManagerInfo";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import Heading from "@/components/ui/Heading";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { activeManager, managersTeam } from "@/machines/selectors";
import Button from "@/components/ui/Button";

const Lineup: FC = () => {
  const manager = useGameContext(activeManager);
  const team = useGameContext(managersTeam(manager.id));

  const game = GameMachineContext.useActorRef();

  if (team.kind === "ai") {
    return;
  }

  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Heading level={2}>Kokoonpano</Heading>

      <Button
        onClick={() => {
          game.send({
            type: "AUTO_LINEUP",
            payload: {
              manager: manager.id
            }
          });
        }}
      >
        AUTO
      </Button>

      <pre>{JSON.stringify(team.lineup, null, 2)}</pre>
    </AdvancedHeaderedPage>
  );
};

export default Lineup;
