import React from "react";
import { Link } from "react-router-dom";
import Calendar from "../ui/containers/CalendarContainer";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nth } from "ramda";

const CurrentEntry = styled.div`
  padding: 0.5em;
  border: 1px dotted rgb(225, 225, 225);
`;

const Current = props => {
  const { invitations, manager, teams, className } = props;

  const team = teams.get(manager.get("team"));

  return (
    <div className={className}>
      {invitations.filter(i => !i.get("participate")).count() > 0 && (
        <CurrentEntry>
          <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
          Pöydälläsi odottaa{" "}
          <Link to="/kutsut">avaamattomia kutsuja joulutauon turnauksiin.</Link>
        </CurrentEntry>
      )}

      <Calendar
        when={(turn, c) => {
          const nextTurn = nth(turn.round + 1, c);
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

      <Calendar when={ce => ce.crisisMeeting && team.get("morale") <= -3}>
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
