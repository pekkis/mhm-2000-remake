import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { Lineup, PenaltyKillTeam } from "@/state/lineup";
import type { LineupTarget } from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  team: PenaltyKillTeam;
  players: Record<string, HiredPlayer>;
  lineup: Lineup;
  appearances: Map<string, number>;
  onAssign: (target: LineupTarget, playerId: string | null) => void;
};

export const PenaltyKillView: FC<Props> = ({
  team,
  players,
  lineup,
  appearances,
  onAssign
}) => {
  return (
    <Cluster>
      <PlayerView
        players={players}
        id={team.ld}
        slot="d"
        target={{ unit: "pk", position: "ld" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
      <PlayerView
        players={players}
        id={team.rd}
        slot="d"
        target={{ unit: "pk", position: "rd" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
      <PlayerView
        players={players}
        id={team.f1}
        slot="pkf"
        target={{ unit: "pk", position: "f1" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
      <PlayerView
        players={players}
        id={team.f2}
        slot="pkf"
        target={{ unit: "pk", position: "f2" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
    </Cluster>
  );
};
