import { PlayerSelect } from "@/components/lineup/PlayerSelect";
import { PlayerName } from "@/components/player/PlayerName";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";
import type { LineupSlot } from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";

type Props = {
  players: Record<string, HiredPlayer>;
  id: string | null;
  slot: LineupSlot;
};

export const PlayerView: FC<Props> = ({ id, players, slot }) => {
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
          onSelect={(selected) => {
            console.log("HA HAA", selected);
          }}
        />
      </Stack>
    </Box>
  );
};
