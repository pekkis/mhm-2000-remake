import type { FC } from "react";
import Button from "@/components/ui/Button";
import Stack from "@/components/ui/Stack";
import pranks from "@/game/pranks";
import { currency as c } from "@/services/format";
import type { HumanManager } from "@/state/game";
import { entries } from "remeda";

type SelectTypeProps = {
  manager: HumanManager;
  selectType: (type: string) => void;
  competition: string;
  enabled: boolean;
  cancel?: (id: string) => void;
};

const SelectType: FC<SelectTypeProps> = ({
  manager,
  selectType,
  competition,
  enabled
}) => {
  return (
    <div>
      <Stack>
        {entries(pranks).map(([key, prank]) => {
          const price = prank.price(competition);

          return (
            <Button
              disabled={!enabled || price > manager.balance}
              block
              key={key}
              onClick={() => {
                selectType(key);
              }}
            >
              <div>{prank.name}</div>
              <div>
                <small>{c(price)}</small>
              </div>
            </Button>
          );
        })}
      </Stack>
    </div>
  );
};

export default SelectType;
