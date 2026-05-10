import { values } from "remeda";

import strategies, { type StrategyId } from "@/data/mhm2000/strategies";
import Button from "./ui/Button";
import Paragraph from "./ui/Paragraph";
import Heading from "./ui/Heading";
import Markdown from "./Markdown";
import Stack from "./ui/Stack";
import {
  activeManager,
  activeManagersTeam,
  hasCompletedAction
} from "@/machines/selectors";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import ManagerInfo from "@/components/ManagerInfo";

const SelectStrategy = () => {
  const manager = GameMachineContext.useSelector((state) =>
    activeManager(state.context)
  );
  const team = GameMachineContext.useSelector((state) =>
    activeManagersTeam(state.context)
  );
  const actor = GameMachineContext.useActorRef();
  const done = useGameContext(hasCompletedAction(manager.id, "strategy"));

  if (done) {
    const currentStrategy = strategies[team.strategy as StrategyId];
    return (
      <AdvancedHeaderedPage escTo="/" managerInfo={<ManagerInfo details />}>
        <Heading level={2}>Harjoittelustrategia</Heading>
        <Stack>
          <Heading level={3}>{currentStrategy?.name}</Heading>
          <Markdown>{currentStrategy?.description ?? ""}</Markdown>
          <Paragraph>Strategia valittu ✓</Paragraph>
        </Stack>
      </AdvancedHeaderedPage>
    );
  }

  return (
    <AdvancedHeaderedPage escTo="/" managerInfo={<ManagerInfo details />}>
      <Heading level={2}>Valitse harjoittelustrategia</Heading>

      <Paragraph>
        On kesä, ja aika määrätä mihin joukkue ajoittaa huippukuntonsa! Tarjolla
        on kolme vaihtoehtoa:
      </Paragraph>

      <Stack>
        {values(strategies).map((strategy) => (
          <Stack key={strategy.id} gap="sm">
            <Heading level={3}>{strategy.name}</Heading>
            <Markdown>{strategy.description}</Markdown>
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
