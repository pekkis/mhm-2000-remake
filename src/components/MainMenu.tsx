import Situation from "./context-sensitive/Situation";
import ManagerInfo from "./ManagerInfo";
import StickyMenu from "./StickyMenu";
import Forward from "./context-sensitive/Forward";
import Current from "./context-sensitive/Current";

import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import {
  activeManager,
  activeManagersTeam,
  interestingCompetitions
} from "@/machines/selectors";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import Stack from "@/components/ui/Stack";
import { useHotkeys } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { getEffective } from "@/services/effects";

const MainMenu = () => {
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const competitions = useGameContext((ctx) => ctx.competitions);
  const interesting = useGameContext(interestingCompetitions);
  const team = useGameContext(activeManagersTeam);
  const gameActor = GameMachineContext.useActorRef();
  const navigate = useNavigate();

  const effectiveTeam = getEffective(team);

  useHotkeys([
    ["a", () => navigate("/pelaajat")],
    [
      "shift+ArrowUp",
      () => {
        const next = Math.min(2, effectiveTeam.intensity + 1) as 0 | 1 | 2;
        gameActor.send({
          type: "SET_INTENSITY",
          payload: { manager: manager.id, intensity: next }
        });
      }
    ],
    [
      "shift+ArrowDown",
      () => {
        const next = Math.max(0, effectiveTeam.intensity - 1) as 0 | 1 | 2;
        gameActor.send({
          type: "SET_INTENSITY",
          payload: { manager: manager.id, intensity: next }
        });
      }
    ]
  ]);

  return (
    <AdvancedHeaderedPage
      stickyMenu={
        <StickyMenu
          menu
          forward={<Forward />}
          onAdvance={() =>
            gameActor.send({ type: "END_TURN", manager: manager.id })
          }
        />
      }
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Current />

        <Situation
          manager={manager}
          competitions={competitions}
          interesting={interesting}
          teams={teams}
        />
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default MainMenu;
