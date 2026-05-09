import type { Player } from "@/state/player";
import type { FC } from "react";

type Props = {
  player: Player;
};

export const PlayerName: FC<Props> = ({ player }) => {
  return <>{player.surname}</>;
};
