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
import Stack from "@/components/ui/Stack";
import { ForwardLineView } from "@/components/lineup/ForwardLineView";
import { GoalieView } from "@/components/lineup/GoalieView";
import { DefensivePairingView } from "@/components/lineup/DefencivePairingView";

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

      <Stack gap="lg">
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

        <Stack gap="sm">
          <GoalieView players={team.players} g={team.lineup.g} />

          {team.lineup.defensivePairings.map((defensivePairing, id) => {
            return (
              <DefensivePairingView
                key={id}
                players={team.players}
                pairing={defensivePairing}
              />
            );
          })}

          {team.lineup.forwardLines.map((forwardLine, id) => {
            return (
              <ForwardLineView
                key={id}
                players={team.players}
                line={forwardLine}
              />
            );
          })}
        </Stack>

        <pre>{JSON.stringify(team.lineup, null, 2)}</pre>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Lineup;
