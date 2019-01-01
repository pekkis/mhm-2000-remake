import React from "react";
import EventsList from "./events/Events";
import PlayerInfo from "./player/PlayerInfo";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";

const Events = props => {
  const { player, teams, resolveEvent, events } = props;

  return (
    <HeaderedPage>
      <Header />
      <PlayerInfo player={player} teams={teams} />
      <EventsList player={player} events={events} resolveEvent={resolveEvent} />
    </HeaderedPage>
  );
};

export default Events;
