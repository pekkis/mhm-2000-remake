import { useSelector } from "@xstate/react";
import type { AnyActorRef } from "xstate";
import type { ContractNegotiationContext } from "@/machines/contractNegotiation";
import { GameMachineContext } from "@/context/game-machine-context";
import AdvancedHeaderedPage from "@/components/ui/AdvancedHeaderedPage";
import ManagerInfo from "@/components/ManagerInfo";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import Stack from "@/components/ui/Stack";
import Markdown from "@/components/Markdown";

const CLAUSE_LABELS: Record<ContractNegotiationContext["clause"], string> = {
  none: "Ei erityisehtoa",
  nhl: "NHL-optio",
  "free-fire": "Vapaapotku"
};

const ContractNegotiationView = () => {
  const gameActor = GameMachineContext.useActorRef();
  const negotiationActor = gameActor.system.get(
    "contractNegotiation"
  ) as AnyActorRef;

  console.log("NEGOTIATION ACTOR", negotiationActor);

  const ctx = useSelector(
    negotiationActor,
    (snap: { context: ContractNegotiationContext }) => snap.context
  );

  console.log("CTX", ctx);

  const send = (type: string) => negotiationActor.send({ type });

  return (
    <AdvancedHeaderedPage managerInfo={<ManagerInfo details />}>
      <Stack gap="lg">
        <Heading level={2}>Sopimusneuvottelu</Heading>

        <Stack gap="sm">
          {ctx.playerLines.map((line, i) => (
            <Markdown key={i}>{line}</Markdown>
          ))}
        </Stack>

        <Stack gap="sm">
          <Heading level={3}>Tarjous</Heading>

          <div>
            <Button onClick={() => send("DECREASE_DURATION")}>◄</Button>{" "}
            {ctx.duration} {ctx.duration === 1 ? "vuosi" : "vuotta"}{" "}
            <Button onClick={() => send("INCREASE_DURATION")}>►</Button>
          </div>

          <div>
            <Button onClick={() => send("PREV_CLAUSE")}>◄</Button>{" "}
            {CLAUSE_LABELS[ctx.clause]}{" "}
            <Button onClick={() => send("NEXT_CLAUSE")}>►</Button>
          </div>

          <div>
            <Button onClick={() => send("DECREASE_SALARY")}>◄</Button>{" "}
            {ctx.offeredSalary} mk{" "}
            <Button onClick={() => send("INCREASE_SALARY")}>►</Button>{" "}
            <Button onClick={() => send("RESET_SALARY")}>Reset</Button>
          </div>
        </Stack>

        <Stack gap="sm">
          <Button block onClick={() => send("NEGOTIATE")}>
            Neuvottele!
          </Button>
          <Button block onClick={() => send("QUIT")}>
            Lyö luuri korvaan
          </Button>
        </Stack>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default ContractNegotiationView;
