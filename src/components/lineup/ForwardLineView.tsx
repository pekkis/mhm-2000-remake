import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { ForwardLine } from "@/state/lineup";
import type { LineupTarget } from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  index: number;
  line: ForwardLine;
  players: Record<string, HiredPlayer>;
  appearances: Map<string, number>;
  onAssign: (target: LineupTarget, playerId: string | null) => void;
};

export const ForwardLineView: FC<Props> = ({
  index,
  players,
  line,
  appearances,
  onAssign,
}) => {
  return (
    <Cluster>
      <PlayerView
        players={players}
        id={line.lw}
        slot="lw"
        target={{ unit: "f", index, position: "lw" }}
        appearances={appearances}
        onAssign={onAssign}
      />
      <PlayerView
        players={players}
        id={line.c}
        slot="c"
        target={{ unit: "f", index, position: "c" }}
        appearances={appearances}
        onAssign={onAssign}
      />
      <PlayerView
        players={players}
        id={line.rw}
        slot="rw"
        target={{ unit: "f", index, position: "rw" }}
        appearances={appearances}
        onAssign={onAssign}
      />
    </Cluster>
  );
};
