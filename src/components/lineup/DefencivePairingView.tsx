import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { DefensivePairing } from "@/state/lineup";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  pairing: DefensivePairing;
  players: Record<string, HiredPlayer>;
  appearances: Map<string, number>;
};

export const DefensivePairingView: FC<Props> = ({ players, pairing, appearances }) => {
  return (
    <Cluster>
      <PlayerView players={players} id={pairing.ld} slot="d" appearances={appearances} />
      <PlayerView players={players} id={pairing.rd} slot="d" appearances={appearances} />
    </Cluster>
  );
};
