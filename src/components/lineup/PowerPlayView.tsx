import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { PowerPlayTeam } from "@/state/lineup";
import type { FC } from "react";

type Props = {
  team: PowerPlayTeam;
};

export const PowerPlayView: FC<Props> = ({ team }) => {
  return (
    <Cluster>
      <PlayerView
        id={team.ld}
        slot="d"
        target={{ unit: "pp", position: "ld" }}
      />
      <PlayerView
        id={team.rd}
        slot="d"
        target={{ unit: "pp", position: "rd" }}
      />
      <PlayerView
        id={team.lw}
        slot="lw"
        target={{ unit: "pp", position: "lw" }}
      />
      <PlayerView id={team.c} slot="c" target={{ unit: "pp", position: "c" }} />
      <PlayerView
        id={team.rw}
        slot="rw"
        target={{ unit: "pp", position: "rw" }}
      />
    </Cluster>
  );
};
