import Badge from "@/components/ui/Badge";
import type { AlertLevel } from "@/components/ui/Alert";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";
import { applyPositionPenalty, performanceModifier } from "@/services/lineup";
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
  if (count <= 0) {return null;}
  if (count === 1) {return "info";}
  if (count === 2) {return "warning";}
  return "danger";
};

type Props = {
  players: Record<string, HiredPlayer>;
  slot: LineupSlot;
  label: string;
  selected: string | null;
  appearances: Map<string, number>;
  excluded: Set<string>;
  onSelect: (playerId: string) => void;
};

export const PlayerSelect: FC<Props> = ({
  players,
  slot,
  label,
  selected,
  appearances,
  excluded,
  onSelect
}) => {
  const sorted = useMemo(
    () =>
      values(players).toSorted(
        (a, b) => slotSkill(b, slot) - slotSkill(a, slot)
      ),
    [players, slot]
  );

  const selectedPlayer = selected ? players[selected] : null;
  const selectedCount = selected ? (appearances.get(selected) ?? 0) : 0;
  const selectedBadgeLevel = appearanceLevel(selectedCount);
  const selectId = `lineup-${label}`;

  return (
    <Stack gap="xs">
      <label htmlFor={selectId}>{label}</label>
      <select
        id={selectId}
        className={selectRoot}
        value={selected ?? ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <button>
          {selectedPlayer ? (
            <Box p="xs">
              {selectedPlayer.surname} (
              {selectedPlayer.position.toUpperCase()}{" "}
              {slotSkill(selectedPlayer, slot)}){" "}
              {selectedBadgeLevel && (
                <Badge level={selectedBadgeLevel}>{selectedCount}</Badge>
              )}
            </Box>
          ) : (
            <Box p="xs">—</Box>
          )}
        </button>

        <option value="">—</option>

        {sorted.map((player) => {
          const count = appearances.get(player.id) ?? 0;
          const level = appearanceLevel(count);
          const isExcluded = excluded.has(player.id);

          return (
            <option
              key={player.id}
              value={player.id}
              className={option}
              disabled={isExcluded}
            >
              <Box p="xs">
                {player.surname} ({player.position.toUpperCase()}{" "}
                {slotSkill(player, slot)}){" "}
                {level && <Badge level={level}>{count}</Badge>}
              </Box>
            </option>
          );
        })}
      </select>
    </Stack>
  );
};
