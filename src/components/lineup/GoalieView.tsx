import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  g: string | null;
  players: Record<string, HiredPlayer>;
};

export const GoalieView: FC<Props> = ({ players, g }) => {
  return (
    <Cluster>
      <PlayerView players={players} id={g} />
    </Cluster>
  );
};
