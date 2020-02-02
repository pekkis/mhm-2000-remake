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
  managersTeam
} from "../../services/selectors";
import { MapOf } from "../../types/base";
import { Team } from "../../types/team";

const CurrentEntry = styled.div`
  padding: 0.5em;
  border: 1px dotted rgb(225, 225, 225);
`;

const Current = props => {
  const manager = useSelector(activeManager);
  if (!manager.team) {
    throw new Error("No team");
  }

  const teams: MapOf<Team> = useSelector(allTeamsMap);
  const team = teams[manager.team];

  const invitations = useSelector((state: MHMState) =>
    state.invitation.invitations.filter(
      i => i.manager === manager.id && !i.participate
    )
  );

  return (
    <div
      css={{
        marginBottom: "1em"
      }}
    >
      <CurrentEntry>
        <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
        Et ole vielä{" "}
        <Link to="/budjetti/organisaatio">budjetoinut organisaatiota</Link>{" "}
        alkavalle kaudelle.
      </CurrentEntry>

      <CurrentEntry>
        <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
        Et ole vielä <Link to="/sponsorit">
          neuvotellut sponsorisopimuksia
        </Link>{" "}
        alkavalle kaudelle.
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
          <Link to="/kutsut">avaamattomia kutsuja joulutauon turnauksiin.</Link>
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
    </div>
  );
};

export default styled(Current)`
  margin-bottom: 1em;
`;
