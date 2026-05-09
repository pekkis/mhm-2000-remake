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
import { PowerPlayView } from "@/components/lineup/PowerPlayView";
import { PenaltyKillView } from "@/components/lineup/PenaltyKillView";
import { lineupAppearances } from "@/services/lineup";
import type { LineupTarget } from "@/services/lineup";
import { useCallback, useMemo } from "react";

const Lineup: FC = () => {
  const manager = useGameContext(activeManager);
  const team = useGameContext(managersTeam(manager.id));

  const game = GameMachineContext.useActorRef();

  const lineup = team.kind === "human" ? team.lineup : undefined;

  const appearances = useMemo(
    () => (lineup ? lineupAppearances(lineup) : new Map<string, number>()),
    [lineup]
  );

  const onAssign = useCallback(
    (target: LineupTarget, playerId: string | null) => {
      game.send({
        type: "ASSIGN_PLAYER_TO_LINEUP",
        payload: { manager: manager.id, target, playerId }
      });
    },
    [game, manager.id]
  );

  if (team.kind !== "human") {
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
          <GoalieView
            players={team.players}
            g={team.lineup.g}
            lineup={team.lineup}
            appearances={appearances}
            onAssign={onAssign}
          />

          {team.lineup.defensivePairings.map((defensivePairing, id) => {
            return (
              <DefensivePairingView
                key={id}
                index={id}
                players={team.players}
                pairing={defensivePairing}
                lineup={team.lineup}
                appearances={appearances}
                onAssign={onAssign}
              />
            );
          })}

          {team.lineup.forwardLines.map((forwardLine, id) => {
            return (
              <ForwardLineView
                key={id}
                index={id}
                players={team.players}
                line={forwardLine}
                lineup={team.lineup}
                appearances={appearances}
                onAssign={onAssign}
              />
            );
          })}
        </Stack>

        <Heading level={3}>Ylivoimakenttä</Heading>
        <PowerPlayView
          team={team.lineup.powerplayTeam}
          players={team.players}
          lineup={team.lineup}
          appearances={appearances}
          onAssign={onAssign}
        />

        <Heading level={3}>Alivoimakenttä</Heading>
        <PenaltyKillView
          team={team.lineup.penaltyKillTeam}
          players={team.players}
          lineup={team.lineup}
          appearances={appearances}
          onAssign={onAssign}
        />

        <pre>{JSON.stringify(team.lineup, null, 2)}</pre>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Lineup;
