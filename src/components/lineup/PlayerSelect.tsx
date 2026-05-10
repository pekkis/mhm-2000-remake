import Badge from "@/components/ui/Badge";
import type { AlertLevel } from "@/components/ui/Alert";
import {
  applyPositionPenalty,
  performanceModifier,
  excludedPlayers
} from "@/services/lineup";
import type { LineupSlot, LineupTarget } from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import * as Select from "@radix-ui/react-select";
import { use, type FC } from "react";
import { values } from "remeda";
import {
  content,
  item,
  playerName,
  positionTag,
  skillValue,
  trigger,
  viewport
} from "./PlayerSelect.css";
import { LineupContext } from "./LineupContext";

/**
 * Position-adjusted skill for display & sorting in a specific slot.
 * Uses position penalty only (no specialty, no condition) — this is
 * UI guidance for the human manager, not the gameday calculation.
 */
export const slotSkill = (player: HiredPlayer, slot: LineupSlot): number =>
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
export const appearanceLevel = (count: number): AlertLevel | null => {
  if (count <= 0) {
    return null;
  }
  if (count === 1) {
    return "info";
  }
  if (count === 2) {
    return "warning";
  }
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

/**
 * Cheap button trigger — renders the current player (or empty label).
 * Clicking opens the single shared picker for this slot.
 */
type SlotTriggerProps = {
  id: string | null;
  slot: LineupSlot;
  label: string;
  target: LineupTarget;
};

export const PlayerSlotTrigger: FC<SlotTriggerProps> = ({
  id,
  slot,
  label,
  target
}) => {
  const ctx = use(LineupContext)!;
  const { players, appearances, openSlot } = ctx;

  const selectedPlayer = id ? players[id] : null;
  const selectedCount = id ? (appearances.get(id) ?? 0) : 0;
  const badgeLevel = appearanceLevel(selectedCount);

  return (
    <button
      type="button"
      className={trigger}
      onClick={() => openSlot(target, slot)}
    >
      {selectedPlayer ? (
        <>
          <PlayerInfo player={selectedPlayer} slot={slot} />
          {badgeLevel && <Badge level={badgeLevel}>{selectedCount}</Badge>}
        </>
      ) : (
        `${label}: —`
      )}
    </button>
  );
};

/**
 * Full Radix Select — mounted only for the one active slot.
 * Opens immediately via `defaultOpen`, closes → resets active slot.
 */
type PickerProps = {
  slot: LineupSlot;
  selected: string | null;
};

export const PlayerPicker: FC<PickerProps> = ({ slot, selected }) => {
  const ctx = use(LineupContext)!;
  const { players, appearances, onAssign, activeTarget, closeSlot } = ctx;
  const excluded = activeTarget
    ? excludedPlayers(ctx.lineup, activeTarget)
    : new Set<string>();

  const sorted = values(players).toSorted(
    (a, b) => slotSkill(b, slot) - slotSkill(a, slot)
  );

  const selectedPlayer = selected ? players[selected] : null;
  const selectedCount = selected ? (appearances.get(selected) ?? 0) : 0;
  const selectedBadgeLevel = appearanceLevel(selectedCount);

  const NONE = "__none__";

  return (
    <Select.Root
      defaultOpen
      value={selected ?? NONE}
      onValueChange={(value) => {
        if (activeTarget) {
          onAssign(activeTarget, value === NONE ? null : value);
        }
        closeSlot();
      }}
      onOpenChange={(open) => {
        if (!open) {
          closeSlot();
        }
      }}
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
            `— `
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
                  <Select.ItemText>{playerLabel(player, slot)}</Select.ItemText>
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
