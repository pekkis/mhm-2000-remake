import type { HiredPlayer } from "@/state/player";
import type { FC } from "react";
import { values } from "remeda";

type Props = {
  players: Record<string, HiredPlayer>;
  sorter?: (a: HiredPlayer, b: HiredPlayer) => number;
  selected: string | null;
  handleChange: (id: number) => void;
};

type PlayerSelectOption = {
  key: string;
  label: string;
};

export const PlayerSelect: FC<Props> = ({
  players,
  sorter = (a, b) => {
    return a.skill - b.skill;
  },
  selected,
  handleChange
}) => {
  const selectedValue = selected || "";

  console.log({
    selectedValue
  });

  const options: PlayerSelectOption[] = [
    {
      key: "",
      label: "..."
    },
    ...values(players)
      .toSorted(sorter)
      .map((player) => {
        return {
          key: player.id,
          label: player.surname
        };
      })
  ];

  return (
    <select value={selectedValue}>
      {options.map((option) => {
        console.log({
          selectedValue,
          key: option.key
        });

        return (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
};
