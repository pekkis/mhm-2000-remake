import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { PenaltyKillTeam } from "@/state/lineup";
import type { FC } from "react";

type Props = {
  team: PenaltyKillTeam;
};

export const PenaltyKillView: FC<Props> = ({ team }) => {
  return (
    <Cluster>
      <PlayerView
        id={team.ld}
        slot="d"
        target={{ unit: "pk", position: "ld" }}
      />
      <PlayerView
        id={team.rd}
        slot="d"
        target={{ unit: "pk", position: "rd" }}
      />
      <PlayerView
        id={team.f1}
        slot="pkf"
        target={{ unit: "pk", position: "f1" }}
      />
      <PlayerView
        id={team.f2}
        slot="pkf"
        target={{ unit: "pk", position: "f2" }}
      />
    </Cluster>
  );
};
