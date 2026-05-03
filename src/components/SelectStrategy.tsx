import { values } from "remeda";

import strategies from "@/data/mhm2000/strategies";
import Button from "./ui/Button";
import Paragraph from "./ui/Paragraph";
import Heading from "./ui/Heading";
import Stack from "./ui/Stack";
import { activeManager } from "@/machines/selectors";
import { GameMachineContext } from "@/context/game-machine-context";
import AdvancedHeaderedPage from "@/components/ui/AdvancedHeaderedPage";
import ManagerInfo from "@/components/ManagerInfo";

const SelectStrategy = () => {
  const manager = GameMachineContext.useSelector((state) =>
    activeManager(state.context)
  );
  const actor = GameMachineContext.useActorRef();

  return (
    <AdvancedHeaderedPage managerInfo={<ManagerInfo details />}>
      <Heading level={2}>Valitse harjoittelustrategia</Heading>

      <Paragraph>
        On kesä, ja aika määrätä mihin joukkue ajoittaa huippukuntonsa! Tarjolla
        on kolme vaihtoehtoa:
      </Paragraph>

      <Stack>
        {values(strategies).map((strategy) => (
          <Stack key={strategy.id} gap="sm">
            <Heading level={3}>{strategy.name}</Heading>
            <Paragraph>{strategy.description}</Paragraph>
            <Button
              block
              onClick={() =>
                actor.send({
                  type: "SELECT_STRATEGY",
                  payload: {
                    manager: manager.id,
                    strategy: strategy.id
                  }
                })
              }
            >
              Valitse strategia "{strategy.name}"
            </Button>
          </Stack>
        ))}
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default SelectStrategy;
