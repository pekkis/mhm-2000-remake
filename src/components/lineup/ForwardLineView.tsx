import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { ForwardLine } from "@/state/lineup";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  line: ForwardLine;
  players: Record<string, HiredPlayer>;
};

export const ForwardLineView: FC<Props> = ({ players, line }) => {
  return (
    <Cluster>
      <PlayerView players={players} id={line.lw} slot="lw" />
      <PlayerView players={players} id={line.c} slot="c" />
      <PlayerView players={players} id={line.rw} slot="rw" />
    </Cluster>
  );
};
