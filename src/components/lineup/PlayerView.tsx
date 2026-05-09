import { PlayerSelect } from "@/components/lineup/PlayerSelect";
import { PlayerName } from "@/components/player/PlayerName";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";
import type { LineupSlot, LineupTarget } from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  players: Record<string, HiredPlayer>;
  id: string | null;
  slot: LineupSlot;
  target: LineupTarget;
  appearances: Map<string, number>;
  onAssign: (target: LineupTarget, playerId: string | null) => void;
};

export const PlayerView: FC<Props> = ({
  id,
  players,
  slot,
  target,
  appearances,
  onAssign,
}) => {
  const player = id ? players[id] : null;

  if (!player) {
    return <Box p="xs">...</Box>;
  }

  return (
    <Box p="xs">
      <Stack gap="xs">
        <PlayerName player={player} />
        <PlayerSelect
          players={players}
          slot={slot}
          selected={id}
          appearances={appearances}
          onSelect={(playerId) => {
            onAssign(target, playerId || null);
          }}
        />
      </Stack>
    </Box>
  );
};
