import ManagerInfo from "./ManagerInfo";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import Button from "./ui/Button";
import BettingForm from "./championship-betting/BettingForm";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { activeManager, hasCompletedAction } from "@/machines/selectors";
import Heading from "@/components/ui/Heading";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";
import Paragraph from "@/components/ui/Paragraph";

const ChampionshipBetting = () => {
  const manager = GameMachineContext.useSelector((state) =>
    activeManager(state.context)
  );
  const teams = GameMachineContext.useSelector((state) => state.context.teams);
  const competitions = GameMachineContext.useSelector(
    (state) => state.context.competitions
  );
  const actor = GameMachineContext.useActorRef();
  const done = useGameContext(
    hasCompletedAction(manager.id, "championshipBet")
  );

  if (done) {
    return (
      <AdvancedHeaderedPage escTo="/" managerInfo={<ManagerInfo details />}>
        <Heading level={2}>Mestariveikkaus</Heading>
        <Paragraph>Mestariveikkaus tehty ✓</Paragraph>
      </AdvancedHeaderedPage>
    );
  }

  return (
    <AdvancedHeaderedPage escTo="/" managerInfo={<ManagerInfo details />}>
      <Stack>
        <Heading level={2}>Mestariveikkaus</Heading>

        <Box>
          On vuosittaisen <strong>mestariveikkauksen aika</strong>. Tässä
          ehdokkaat ja heidän kertoimensa.
        </Box>

        <BettingForm
          manager={manager}
          betChampion={(
            managerId: string,
            teamId: number,
            amount: number,
            odds: number
          ) =>
            actor.send({
              type: "PLACE_CHAMPION_BET",
              payload: {
                manager: managerId,
                team: teamId,
                amount,
                odds
              }
            })
          }
          competition={competitions.phl}
          teams={teams}
        />

        <Button
          secondary
          block
          onClick={() =>
            actor.send({
              type: "SKIP_CHAMPION_BET",
              payload: { manager: manager.id }
            })
          }
        >
          En halua veikata
        </Button>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default ChampionshipBetting;
