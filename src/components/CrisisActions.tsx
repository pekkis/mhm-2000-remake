import Button from "./ui/Button";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import ManagerInfo from "./ManagerInfo";
import Calendar from "./ui/Calendar";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import Paragraph from "./ui/Paragraph";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";

import crisis from "@/data/crisis";
import { currency as c } from "@/services/format";
import { getEffective } from "@/services/effects";
import { activeManager, canCrisisMeeting } from "@/machines/selectors";

const CrisisActions = () => {
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const competitions = useGameContext((ctx) => ctx.competitions);
  const canDo = useGameContext(canCrisisMeeting(manager.id));
  const gameActor = GameMachineContext.useActorRef();

  const team = getEffective(teams[manager.team!]);
  const crisisInfo = crisis(team, competitions);

  return (
    <AdvancedHeaderedPage
      escTo="/"
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Kriisipalaveri</Heading>

        <Calendar
          when={(c) => c.crisisMeeting}
          fallback={
            <Paragraph>
              Tässä vaiheessa kautta on auttamatta liian myöhäistä
              kriisipalaveroida!
            </Paragraph>
          }
        >
          <Stack gap="md">
            <Paragraph>
              Kriisipalaveri auttaa joukkuetta unohtamaan tappioputken ja
              keskittymään tulevaan. Se maksaa {c(crisisInfo.amount)}.
            </Paragraph>

            <Button
              block
              disabled={!canDo}
              onClick={() =>
                gameActor.send({
                  type: "CRISIS_MEETING",
                  payload: { manager: manager.id }
                })
              }
            >
              Pidä kriisipalaveri
            </Button>
          </Stack>
        </Calendar>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default CrisisActions;
