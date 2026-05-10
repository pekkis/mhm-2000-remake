import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { FC } from "react";

type Props = {
  g: string | null;
};

export const GoalieView: FC<Props> = ({ g }) => {
  return (
    <Cluster>
      <PlayerView id={g} slot="g" target={{ unit: "g" }} />
    </Cluster>
  );
};
