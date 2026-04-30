import { Link } from "react-router-dom";
import Calendar from "@/components/ui/Calendar";
import { useGameContext } from "@/context/game-machine-context";
import {
  activeManagersInvitations,
  activeManagersTeam
} from "@/machines/selectors";
import Stack from "@/components/ui/Stack";
import Alert from "@/components/ui/Alert";

const Current = () => {
  const invitations = useGameContext(activeManagersInvitations);
  const team = useGameContext(activeManagersTeam);

  const numberOfAcceptedInvititations = invitations.filter(
    (i) => !i.accepted
  ).length;

  return (
    <Stack gap="sm">
      {numberOfAcceptedInvititations > 0 && (
        <Alert level="info">
          Pöydälläsi odottaa{" "}
          <Link to="/kutsut">avaamattomia kutsuja joulutauon turnauksiin.</Link>
        </Alert>
      )}

      <Calendar
        when={(entry, c) => {
          const nextTurn = c[entry.round + 1];
          return entry.transferMarket && !nextTurn.transferMarket;
        }}
      >
        <Alert level="warning">
          Nyt on viimeinen tilaisuutemme{" "}
          <Link to="/pelaajamarkkinat">ostaa pelaajia</Link>, sillä siirtoaika
          umpeutuu seuraavan ottelun jälkeen.
        </Alert>
      </Calendar>

      <Calendar when={(e) => e.crisisMeeting && team.morale <= -3}>
        <Alert level="danger">
          Joukkueen moraali on huono.{" "}
          <Link to="/kriisipalaveri">Kriisipalaveri</Link> auttaisi.
        </Alert>
      </Calendar>
    </Stack>
  );
};

export default Current;
