import Situation from "./context-sensitive/Situation";
import ManagerInfo from "./ManagerInfo";
import StickyMenu from "./StickyMenu";
import Forward from "./context-sensitive/Forward";
import Current from "./context-sensitive/Current";

import { useGameContext } from "@/context/game-machine-context";
import { activeManager, interestingCompetitions } from "@/machines/selectors";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import Stack from "@/components/ui/Stack";

const MainMenu = () => {
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const competitions = useGameContext((ctx) => ctx.competitions);
  const interesting = useGameContext(interestingCompetitions);

  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu menu forward={<Forward />} />}
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
