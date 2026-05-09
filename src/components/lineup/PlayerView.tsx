import { PlayerSelect } from "@/components/lineup/PlayerSelect";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";
import { excludedPlayers } from "@/services/lineup";
import type { LineupSlot, LineupTarget } from "@/services/lineup";
import type { Lineup } from "@/state/lineup";
import type { HiredPlayer } from "@/state/player";
import { type FC, useMemo } from "react";

type Props = {
  players: Record<string, HiredPlayer>;
  id: string | null;
  slot: LineupSlot;
  target: LineupTarget;
  lineup: Lineup;
  appearances: Map<string, number>;
  onAssign: (target: LineupTarget, playerId: string | null) => void;
};

export const PlayerView: FC<Props> = ({
  id,
  players,
  slot,
  target,
  lineup,
  appearances,
  onAssign
}) => {
  const excluded = useMemo(
    () => excludedPlayers(lineup, target),
    [lineup, target]
  );

  return (
    <Box p="xs">
      <Stack gap="xs">
        POSITION TITLE HERE
        <PlayerSelect
          players={players}
          slot={slot}
          selected={id}
          appearances={appearances}
          excluded={excluded}
          onSelect={(playerId) => {
            onAssign(target, playerId || null);
          }}
        />
      </Stack>
    </Box>
  );
};
