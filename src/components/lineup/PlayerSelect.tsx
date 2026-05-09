import Box from "@/components/ui/Box";
import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";
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

type Props = {
  players: Record<string, HiredPlayer>;
  sorter?: (a: HiredPlayer, b: HiredPlayer) => number;
  selected: string | null;
  onSelect: (playerId: string) => void;
};

export const PlayerSelect: FC<Props> = ({
  players,
  sorter = (a, b) => b.skill - a.skill,
  selected,
  onSelect,
}) => {
  const sorted = values(players).toSorted(sorter);

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
            {player.surname} ({player.position.toUpperCase()} {player.skill})
          </Box>
        </option>
      ))}
    </select>
  );
};
