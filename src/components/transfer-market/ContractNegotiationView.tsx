import { useSelector } from "@xstate/react";
import type { AnyActorRef } from "xstate";
import type { ContractNegotiationContext } from "@/machines/contractNegotiation";
import { GameMachineContext } from "@/context/game-machine-context";
import PageLayout from "@/components/page/PageLayout";
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

const OUTCOME_LABELS: Record<string, string> = {
  signed: "Sopimus allekirjoitettu!",
  refused: "Pelaaja kieltäytyi neuvotteluista.",
  playerWalked: "Pelaaja heitti luurin korvaan.",
  alreadyNegotiated: "Pelaaja ei halua jatkaa neuvotteluja tällä viikolla."
};

const ContractNegotiationView = () => {
  const gameActor = GameMachineContext.useActorRef();
  const negotiationActor = gameActor.system.get(
    "contractNegotiation"
  ) as AnyActorRef;

  const snap = useSelector(
    negotiationActor,
    (s: { value: unknown; context: ContractNegotiationContext }) => s
  );

  const ctx = snap.context;
  const inResult = snap.value === "result";
  const send = (type: string) => negotiationActor.send({ type });

  return (
    <PageLayout managerInfo={<ManagerInfo details />}>
      <Stack gap="lg">
        <Heading level={2}>Sopimusneuvottelu</Heading>

        <Stack gap="sm">
          {ctx.playerLines.map((line, i) => (
            <Markdown key={i}>{line}</Markdown>
          ))}
        </Stack>

        {inResult ? (
          <>
            {ctx.result && ctx.result.outcome !== "cancelled" && (
              <Paragraph>
                <strong>{OUTCOME_LABELS[ctx.result.outcome]}</strong>
              </Paragraph>
            )}
            {ctx.result?.outcome === "signed" && (
              <Paragraph>
                Palkka: {ctx.offeredSalary} mk / {ctx.duration}{" "}
                {ctx.duration === 1 ? "vuosi" : "vuotta"}
              </Paragraph>
            )}
            <Button block onClick={() => send("ADVANCE")}>
              Jatka
            </Button>
          </>
        ) : (
          <>
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
          </>
        )}
      </Stack>
    </PageLayout>
  );
};

export default ContractNegotiationView;
