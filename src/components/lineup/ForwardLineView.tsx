import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { ForwardLine } from "@/state/lineup";
import type { FC } from "react";

type Props = {
  index: number;
  line: ForwardLine;
};

export const ForwardLineView: FC<Props> = ({ index, line }) => {
  return (
    <Cluster>
      <PlayerView
        id={line.lw}
        slot="lw"
        target={{ unit: "f", index, position: "lw" }}
      />
      <PlayerView
        id={line.c}
        slot="c"
        target={{ unit: "f", index, position: "c" }}
      />
      <PlayerView
        id={line.rw}
        slot="rw"
        target={{ unit: "f", index, position: "rw" }}
      />
    </Cluster>
  );
};
