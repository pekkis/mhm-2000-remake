import {
  PlayerSlotTrigger,
  PlayerPicker
} from "@/components/lineup/PlayerSelect";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";
import type { LineupSlot, LineupTarget } from "@/services/lineup";
import type { FC } from "react";
import { use } from "react";
import { LineupContext } from "./LineupContext";

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

const targetsMatch = (a: LineupTarget, b: LineupTarget): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

type Props = {
  id: string | null;
  slot: LineupSlot;
  target: LineupTarget;
};

export const PlayerView: FC<Props> = ({ id, slot, target }) => {
  const { activeTarget, activeSlot } = use(LineupContext)!;
  const isActive = activeTarget !== null && targetsMatch(activeTarget, target);

  return (
    <Box p="xs">
      <Stack gap="xs">
        {isActive && activeSlot ? (
          <PlayerPicker slot={activeSlot} selected={id} />
        ) : (
          <PlayerSlotTrigger
            id={id}
            slot={slot}
            label={labelFromTarget(target)}
            target={target}
          />
        )}
      </Stack>
    </Box>
  );
};
