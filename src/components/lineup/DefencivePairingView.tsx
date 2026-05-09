import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { DefensivePairing, Lineup } from "@/state/lineup";
import type { LineupTarget } from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  index: number;
  pairing: DefensivePairing;
  players: Record<string, HiredPlayer>;
  lineup: Lineup;
  appearances: Map<string, number>;
  onAssign: (target: LineupTarget, playerId: string | null) => void;
};

export const DefensivePairingView: FC<Props> = ({
  index,
  players,
  pairing,
  lineup,
  appearances,
  onAssign
}) => {
  return (
    <Cluster>
      <PlayerView
        players={players}
        id={pairing.ld}
        slot="d"
        target={{ unit: "d", index, side: "ld" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
      <PlayerView
        players={players}
        id={pairing.rd}
        slot="d"
        target={{ unit: "d", index, side: "rd" }}
        lineup={lineup}
        appearances={appearances}
        onAssign={onAssign}
      />
    </Cluster>
  );
};
