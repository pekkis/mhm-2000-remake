import Badge from "@/components/ui/Badge";
import type { AlertLevel } from "@/components/ui/Alert";
import { applyPositionPenalty, performanceModifier } from "@/services/lineup";
import type { LineupSlot } from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import * as Select from "@radix-ui/react-select";
import { type FC, useMemo } from "react";
import { values } from "remeda";
import { content, item, playerName, positionTag, skillValue, trigger, viewport } from "./PlayerSelect.css";

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

const playerLabel = (player: HiredPlayer, slot: LineupSlot): string =>
  `${player.surname} (${player.position.toUpperCase()} ${slotSkill(player, slot)})`;

const PlayerInfo: FC<{ player: HiredPlayer; slot: LineupSlot }> = ({
  player,
  slot
}) => (
  <>
    <span className={positionTag}>{player.position}</span>
    <span className={playerName}>{player.surname}</span>
    <span className={skillValue}>{slotSkill(player, slot)}</span>
  </>
);

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

  const NONE = "__none__";

  return (
    <Select.Root
      value={selected ?? NONE}
      onValueChange={(value) => onSelect(value === NONE ? "" : value)}
    >
      <Select.Trigger className={trigger}>
        <Select.Value>
          {selectedPlayer ? (
            <>
              <PlayerInfo player={selectedPlayer} slot={slot} />
              {selectedBadgeLevel && (
                <Badge level={selectedBadgeLevel}>{selectedCount}</Badge>
              )}
            </>
          ) : (
            `${label}: —`
          )}
        </Select.Value>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className={content} position="popper" sideOffset={4}>
          <Select.Viewport className={viewport}>
            <Select.Item value={NONE} className={item}>
              <Select.ItemText>—</Select.ItemText>
            </Select.Item>

            {sorted.map((player) => {
              const count = appearances.get(player.id) ?? 0;
              const level = appearanceLevel(count);
              const isExcluded = excluded.has(player.id);

              return (
                <Select.Item
                  key={player.id}
                  value={player.id}
                  className={item}
                  disabled={isExcluded}
                >
                  <Select.ItemText>
                    {playerLabel(player, slot)}
                  </Select.ItemText>
                  <PlayerInfo player={player} slot={slot} />
                  {level && <Badge level={level}>{count}</Badge>}
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
