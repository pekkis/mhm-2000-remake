import Box from "@/components/ui/Box";
import {
  applyPositionPenalty,
  performanceModifier,
} from "@/services/lineup";
import type { LineupSlot } from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import { type FC, useMemo } from "react";
import { values } from "remeda";
import { option, selectRoot } from "./PlayerSelect.css";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      selectedcontent: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

/**
 * Position-adjusted skill for display & sorting in a specific slot.
 * Uses position penalty only (no specialty, no condition) — this is
 * UI guidance for the human manager, not the gameday calculation.
 */
const slotSkill = (player: HiredPlayer, slot: LineupSlot): number =>
  applyPositionPenalty(
    player.position,
    slot,
    player.skill + performanceModifier(player)
  );

type Props = {
  players: Record<string, HiredPlayer>;
  slot: LineupSlot;
  selected: string | null;
  onSelect: (playerId: string) => void;
};

export const PlayerSelect: FC<Props> = ({
  players,
  slot,
  selected,
  onSelect,
}) => {
  const sorted = useMemo(
    () =>
      values(players).toSorted(
        (a, b) => slotSkill(b, slot) - slotSkill(a, slot)
      ),
    [players, slot]
  );

  return (
    <select
      className={selectRoot}
      value={selected ?? ""}
      onChange={(e) => onSelect(e.target.value)}
    >
      <button>
        <selectedcontent />
      </button>

      <option value="">—</option>

      {sorted.map((player) => (
        <option key={player.id} value={player.id} className={option}>
          <Box p="xs">
            {player.surname} ({player.position.toUpperCase()}{" "}
            {slotSkill(player, slot)})
          </Box>
        </option>
      ))}
    </select>
  );
};
