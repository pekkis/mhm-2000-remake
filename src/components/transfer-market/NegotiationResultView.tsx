import { GameMachineContext } from "@/context/game-machine-context";
import AdvancedHeaderedPage from "@/components/ui/AdvancedHeaderedPage";
import ManagerInfo from "@/components/ManagerInfo";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import Stack from "@/components/ui/Stack";
import Markdown from "@/components/Markdown";

const OUTCOME_LABELS: Record<string, string> = {
  signed: "Sopimus allekirjoitettu!",
  refused: "Pelaaja kieltäytyi neuvotteluista.",
  playerWalked: "Pelaaja heitti luurin korvaan.",
  alreadyNegotiated: "Pelaaja ei halua jatkaa neuvotteluja tällä viikolla."
};

const NegotiationResultView = () => {
  const gameActor = GameMachineContext.useActorRef();
  const pending = GameMachineContext.useSelector(
    (snap) => snap.context.transferMarket.pendingNegotiation
  );

  if (!pending) {
    return null;
  }

  const { result } = pending;

  return (
    <AdvancedHeaderedPage managerInfo={<ManagerInfo details />}>
      <Stack gap="lg">
        <Heading level={2}>Neuvottelun tulos</Heading>

        <Stack gap="sm">
          {result.outcome !== "cancelled" &&
            result.playerLines.map((line, i) => (
              <Markdown key={i}>{line}</Markdown>
            ))}
        </Stack>

        {result.outcome !== "cancelled" && (
          <Paragraph>
            <strong>{OUTCOME_LABELS[result.outcome]}</strong>
          </Paragraph>
        )}

        {result.outcome === "signed" && (
          <Paragraph>
            Palkka: {result.contract.salary} mk / {result.contract.duration}{" "}
            {result.contract.duration === 1 ? "vuosi" : "vuotta"}
            {result.contract.specialClause &&
              ` (${result.contract.specialClause.kind === "nhl" ? "NHL-optio" : "Vapaapotku"})`}
          </Paragraph>
        )}

        <Button block onClick={() => gameActor.send({ type: "ADVANCE" })}>
          Jatka
        </Button>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default NegotiationResultView;
