import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import { useGameContext } from "@/context/game-machine-context";
import { contractNegotiationMachine } from "@/machines/contractNegotiation";
import { activeManager, managersTeam } from "@/machines/selectors";
import random from "@/services/random";
import { useMachine } from "@xstate/react";
import { values } from "remeda";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import Markdown from "@/components/Markdown";
import Button from "@/components/ui/Button";
import Cluster from "@/components/ui/Cluster";
import Input from "@/components/ui/form/Input";

const POCMenu = () => {
  const players = useGameContext((ctx) => ctx.transferMarket.players);

  const player = values(players).find((p) => p.skill <= 4);

  if (!player) {
    throw new Error("No player");
  }

  const manager = useGameContext(activeManager);
  const team = useGameContext(managersTeam(manager.id));

  const [state, send] = useMachine(contractNegotiationMachine, {
    input: {
      mode: "market",
      player,
      alreadyNegotiated: false,
      budget: team.budget!,
      managerCharisma: manager.attributes.charisma,
      managerNegotiation: manager.attributes.negotiation,
      random: random
    }
  });

  return (
    <AdvancedHeaderedPage stickyMenu={<StickyMenu back />}>
      <Stack gap="lg">
        <Heading level={2}>Neuvottele pelaajan kanssa</Heading>

        <Heading level={3}>
          {state.context.player.initial}. {state.context.player.surname}
        </Heading>

        <Stack gap="sm">
          {state.context.playerLines.map((playerLine, i) => {
            return <Markdown key={i}>{playerLine}</Markdown>;
          })}
        </Stack>

        <Cluster>
          <Button
            onClick={() => {
              send({ type: "DECREASE_SALARY" });
            }}
          >
            -
          </Button>{" "}
          <Input readOnly value={state.context.offeredSalary} />{" "}
          <Button
            onClick={() => {
              send({ type: "INCREASE_SALARY" });
            }}
          >
            +
          </Button>
        </Cluster>

        <Button
          disabled={!state.matches("negotiating")}
          onClick={() => {
            send({
              type: "NEGOTIATE"
            });
          }}
        >
          Tarjoa
        </Button>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default POCMenu;
