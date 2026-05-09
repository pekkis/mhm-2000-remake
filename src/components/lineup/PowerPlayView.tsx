import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { Lineup, PowerPlayTeam } from "@/state/lineup";
import type { LineupTarget } from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  team: PowerPlayTeam;
  players: Record<string, HiredPlayer>;
  lineup: Lineup;
  appearances: Map<string, number>;
  onAssign: (target: LineupTarget, playerId: string | null) => void;
};

export const PowerPlayView: FC<Props> = ({
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
        target={{ unit: "pp", position: "ld" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
      <PlayerView
        players={players}
        id={team.rd}
        slot="d"
        target={{ unit: "pp", position: "rd" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
      <PlayerView
        players={players}
        id={team.lw}
        slot="lw"
        target={{ unit: "pp", position: "lw" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
      <PlayerView
        players={players}
        id={team.c}
        slot="c"
        target={{ unit: "pp", position: "c" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
      <PlayerView
        players={players}
        id={team.rw}
        slot="rw"
        target={{ unit: "pp", position: "rw" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
    </Cluster>
  );
};
