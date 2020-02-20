import React from "react";
import { Link } from "react-router-dom";
import Calendar from "../ui/Calendar";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nth } from "ramda";
import { MHMState } from "../../ducks";
import { useSelector } from "react-redux";
import {
  activeManager,
  requireManagersTeam,
  allTeamsMap,
  managersTeam,
  currentTurn,
  requireHumanManagersTeamObj,
  teamsMatchOfTurn
} from "../../services/selectors";
import { MapOf } from "../../types/base";
import { Team } from "../../types/team";
import NextMatch from "./NextMatch";
import { Box } from "theme-ui";

const CurrentEntry = styled.div`
  padding: 0.5em;
  border: 1px dotted rgb(225, 225, 225);
`;

const Current = () => {
  const manager = useSelector(activeManager);
  if (!manager.team) {
    throw new Error("No team");
  }

  const invitations = useSelector((state: MHMState) =>
    state.invitation.invitations.filter(
      i => i.manager === manager.id && !i.participate
    )
  );

  const turn = useSelector(currentTurn);
  const team = useSelector(requireHumanManagersTeamObj(manager.id));
  const teams = useSelector(allTeamsMap);
  const teamsMatch = useSelector(teamsMatchOfTurn(team.id, turn));

  return (
    <div>
      {teamsMatch && (
        <NextMatch
          manager={manager}
          team={team}
          teams={teams}
          match={teamsMatch}
        />
      )}
      <Box my={1} bg="grey" p={1}>
        <h2>Akuutit asiat</h2>

        <CurrentEntry>
          <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
          Et ole vielä{" "}
          <Link to="/budjetti/organisaatio">
            budjetoinut organisaatiota
          </Link>{" "}
          alkavalle kaudelle.
        </CurrentEntry>

        <CurrentEntry>
          <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
          Et ole vielä{" "}
          <Link to="/sponsorit">neuvotellut sponsorisopimuksia</Link> alkavalle
          kaudelle.
        </CurrentEntry>

        {!team.strategy && (
          <CurrentEntry>
            <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
            Et ole vielä <Link to="/strategia">valinnut strategiaa</Link>{" "}
            alkavalle kaudelle.
          </CurrentEntry>
        )}

        {invitations.length > 0 && (
          <CurrentEntry>
            <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
            Pöydälläsi odottaa{" "}
            <Link to="/kutsut">
              avaamattomia kutsuja joulutauon turnauksiin.
            </Link>
          </CurrentEntry>
        )}

        <Calendar
          when={(turn, c) => {
            const nextTurn = nth(turn.round + 1, c);
            if (!nextTurn) {
              return false;
            }
            return turn.transferMarket && !nextTurn.transferMarket;
          }}
        >
          <CurrentEntry>
            <FontAwesomeIcon icon={["fas", "exclamation-circle"]} /> Nyt on
            viimeinen tilaisuutemme{" "}
            <Link to="/pelaajamarkkinat">ostaa pelaajia</Link>, sillä siirtoaika
            umpeutuu seuraavan ottelun jälkeen.
          </CurrentEntry>
        </Calendar>

        <Calendar when={ce => ce.crisisMeeting && team.morale <= -3}>
          <CurrentEntry>
            <FontAwesomeIcon icon={["fas", "exclamation-circle"]} /> Joukkueen
            moraali on huono. <Link to="/kriisipalaveri">Kriisipalaveri</Link>{" "}
            auttaisi.
          </CurrentEntry>
        </Calendar>
      </Box>
    </div>
  );
};

export default Current;
