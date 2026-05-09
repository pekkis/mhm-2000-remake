import Badge from "@/components/ui/Badge";
import type { AlertLevel } from "@/components/ui/Alert";
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

/**
 * Badge level for lineup appearance count (QB `ket`).
 * 0 = bench (no badge), 1 = normal (info), 2 = double-duty (warning),
 * 3+ = lineup bug (danger).
 */
const appearanceLevel = (count: number): AlertLevel | null => {
  if (count <= 0) return null;
  if (count === 1) return "info";
  if (count === 2) return "warning";
  return "danger";
};

type Props = {
  players: Record<string, HiredPlayer>;
  slot: LineupSlot;
  selected: string | null;
  appearances: Map<string, number>;
  onSelect: (playerId: string) => void;
};

export const PlayerSelect: FC<Props> = ({
  players,
  slot,
  selected,
  appearances,
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

      {sorted.map((player) => {
        const count = appearances.get(player.id) ?? 0;
        const level = appearanceLevel(count);

        return (
          <option key={player.id} value={player.id} className={option}>
            <Box p="xs">
              {player.surname} ({player.position.toUpperCase()}{" "}
              {slotSkill(player, slot)}){" "}
              {level && <Badge level={level}>{count}</Badge>}
            </Box>
          </option>
        );
      })}
    </select>
  );
};
