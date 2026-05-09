import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  g: string | null;
  players: Record<string, HiredPlayer>;
  appearances: Map<string, number>;
};

export const GoalieView: FC<Props> = ({ players, g, appearances }) => {
  return (
    <Cluster>
      <PlayerView players={players} id={g} slot="g" appearances={appearances} />
    </Cluster>
  );
};
