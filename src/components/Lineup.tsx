import type { FC } from "react";
import ManagerInfo from "./ManagerInfo";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
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
import { PowerPlayView } from "@/components/lineup/PowerPlayView";
import { PenaltyKillView } from "@/components/lineup/PenaltyKillView";
import { lineupAppearances } from "@/services/lineup";
import type { LineupTarget } from "@/services/lineup";
import { LineupContext } from "@/components/lineup/LineupContext";

const Lineup: FC = () => {
  const manager = useGameContext(activeManager);
  const team = useGameContext(managersTeam(manager.id));
  const game = GameMachineContext.useActorRef();

  if (team.kind !== "human") {
    return;
  }

  const appearances = lineupAppearances(team.lineup);

  const onAssign = (target: LineupTarget, playerId: string | null) => {
    game.send({
      type: "ASSIGN_PLAYER_TO_LINEUP",
      payload: { manager: manager.id, target, playerId }
    });
  };

  return (
    <LineupContext
      value={{
        players: team.players,
        lineup: team.lineup,
        appearances,
        onAssign
      }}
    >
      <AdvancedHeaderedPage
        escTo="/"
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
            <GoalieView g={team.lineup.g} />

            {team.lineup.defensivePairings.map((defensivePairing, id) => (
              <DefensivePairingView
                key={id}
                index={id}
                pairing={defensivePairing}
              />
            ))}

            {team.lineup.forwardLines.map((forwardLine, id) => (
              <ForwardLineView key={id} index={id} line={forwardLine} />
            ))}
          </Stack>

          <Heading level={3}>Ylivoimakenttä</Heading>
          <PowerPlayView team={team.lineup.powerplayTeam} />

          <Heading level={3}>Alivoimakenttä</Heading>
          <PenaltyKillView team={team.lineup.penaltyKillTeam} />
        </Stack>
      </AdvancedHeaderedPage>
    </LineupContext>
  );
};

export default Lineup;
