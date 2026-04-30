import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import ManagerInfo from "./ManagerInfo";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import tournamentList from "@/data/tournaments";
import Button from "./ui/Button";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { activeManager, activeManagersInvitations } from "@/machines/selectors";
import Markdown from "@/components/Markdown";

const Invitations = () => {
  const manager = useGameContext(activeManager);

  const invitations = useGameContext(activeManagersInvitations);
  const actor = GameMachineContext.useActorRef();

  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Turnauskutsut</Heading>

        <Stack gap="md">
          {invitations.map((i, index) => {
            const t = tournamentList[i.tournament];
            return (
              <Stack key={index} gap="sm">
                <Heading level={3}>{t.name}</Heading>

                <Markdown>{t.description(t.award)}</Markdown>

                <Button
                  block
                  onClick={() =>
                    actor.send({
                      type: "ACCEPT_INVITATION",
                      payload: { manager: manager.id, id: i.id }
                    })
                  }
                  disabled={i.accepted}
                >
                  Hyväksy turnauskutsu
                </Button>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Invitations;
