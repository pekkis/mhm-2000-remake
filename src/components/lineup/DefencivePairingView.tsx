import { PlayerView } from "@/components/lineup/PlayerView";
import Cluster from "@/components/ui/Cluster";
import type { DefensivePairing } from "@/state/lineup";
import type { FC } from "react";

type Props = {
  index: number;
  pairing: DefensivePairing;
};

export const DefensivePairingView: FC<Props> = ({ index, pairing }) => {
  return (
    <Cluster>
      <PlayerView
        id={pairing.ld}
        slot="d"
        target={{ unit: "d", index, side: "ld" }}
      />
      <PlayerView
        id={pairing.rd}
        slot="d"
        target={{ unit: "d", index, side: "rd" }}
      />
    </Cluster>
  );
};
