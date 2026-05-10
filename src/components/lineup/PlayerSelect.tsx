import Badge from "@/components/ui/Badge";
import type { AlertLevel } from "@/components/ui/Alert";
import {
  applyPositionPenalty,
  performanceModifier,
  excludedPlayers
} from "@/services/lineup";
import type { LineupSlot, LineupTarget } from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import { use, type FC } from "react";
import { values } from "remeda";
import {
  select,
  option,
  playerName,
  positionTag,
  skillValue
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

const NONE = "";

type Props = {
  slot: LineupSlot;
  label: string;
  selected: string | null;
  target: LineupTarget;
};

export const PlayerSelect: FC<Props> = ({ slot, label, selected, target }) => {
  const { players, appearances, onAssign, lineup } = use(LineupContext)!;
  const excluded = excludedPlayers(lineup, target);

  const sorted = values(players).toSorted(
    (a, b) => slotSkill(b, slot) - slotSkill(a, slot)
  );

  const selectedPlayer = selected ? players[selected] : null;
  const selectedCount = selected ? (appearances.get(selected) ?? 0) : 0;
  const selectedBadgeLevel = appearanceLevel(selectedCount);

  return (
    <select
      className={select}
      value={selected ?? NONE}
      onChange={(e) => {
        onAssign(target, e.target.value || null);
      }}
    >
      <button type="button">
        {selectedPlayer ? (
          <>
            <PlayerInfo player={selectedPlayer} slot={slot} />
            {selectedBadgeLevel && (
              <Badge level={selectedBadgeLevel}>{selectedCount}</Badge>
            )}
          </>
        ) : (
          <span>{label}: —</span>
        )}
      </button>

      <option value={NONE} className={option}>
        {label}: —
      </option>

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
            <PlayerInfo player={player} slot={slot} />
            {level && <Badge level={level}>{count}</Badge>}
          </option>
        );
      })}
    </select>
  );
};
