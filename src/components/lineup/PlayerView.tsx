import { PlayerSelect } from "@/components/lineup/PlayerSelect";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";
import type { LineupSlot, LineupTarget } from "@/services/lineup";
import type { FC } from "react";

const labelFromTarget = (target: LineupTarget): string => {
  switch (target.unit) {
    case "g":
      return "g";
    case "d":
      return target.side;
    case "f":
      return target.position;
    case "pp":
      return target.position;
    case "pk":
      return target.position;
  }
};

type Props = {
  id: string | null;
  slot: LineupSlot;
  target: LineupTarget;
};

export const PlayerView: FC<Props> = ({ id, slot, target }) => {
  return (
    <Box p="xs">
      <Stack gap="xs">
        <PlayerSelect
          slot={slot}
          label={labelFromTarget(target)}
          selected={id}
          target={target}
        />
      </Stack>
    </Box>
  );
};
