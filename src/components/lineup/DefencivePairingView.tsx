import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { DefensivePairing } from "@/state/lineup";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  pairing: DefensivePairing;
  players: Record<string, HiredPlayer>;
};

export const DefensivePairingView: FC<Props> = ({ players, pairing }) => {
  return (
    <Cluster>
      <PlayerView players={players} id={pairing.ld} />
      <PlayerView players={players} id={pairing.rd} />
    </Cluster>
  );
};
