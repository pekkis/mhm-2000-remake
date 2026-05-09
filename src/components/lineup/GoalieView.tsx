import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { LineupTarget } from "@/services/lineup";
import type { Lineup } from "@/state/lineup";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  g: string | null;
  players: Record<string, HiredPlayer>;
  lineup: Lineup;
  appearances: Map<string, number>;
  onAssign: (target: LineupTarget, playerId: string | null) => void;
};

export const GoalieView: FC<Props> = ({
  players,
  g,
  lineup,
  appearances,
  onAssign
}) => {
  return (
    <Cluster>
      <PlayerView
        players={players}
        id={g}
        slot="g"
        target={{ unit: "g" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
    </Cluster>
  );
};
