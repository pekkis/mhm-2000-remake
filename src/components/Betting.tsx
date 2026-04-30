import ManagerInfo from "./ManagerInfo";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import BettingForm from "./betting/BettingForm";
import Box from "./ui/Box";
import Paragraph from "./ui/Paragraph";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { activeManager } from "@/machines/selectors";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";

const Betting = () => {
  const turn = useGameContext((ctx) => ctx.turn);
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const competition = useGameContext((ctx) => ctx.competitions.phl);
  const actor = GameMachineContext.useActorRef();

  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Kavioveikkaus</Heading>

        <Box>
          <Paragraph>
            Pekkalandiassa rahapelejä on aina pyörittänyt, ja tulee aina
            pyörittämään, monopoliyhtiö <strong>Arvaus</strong>. Pelivalikoima
            on kapea, kertoimet huonoja. Tässä viikon kavioveikkauskuponki.
            Onnea matkaan. Kansan terveydelle!
          </Paragraph>

          <BettingForm
            turn={turn}
            teams={teams}
            manager={manager}
            bet={(coupon: string[], amount: number) =>
              actor.send({
                type: "PLACE_BET",
                payload: { manager: manager.id, coupon, amount }
              })
            }
            competition={competition}
          />
        </Box>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Betting;
