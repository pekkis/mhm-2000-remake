import React from "react";
import EventsList from "./events/Events";
import ManagerInfo from "./manager/ManagerInfo";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";

const Events = props => {
  const { manager, teams, resolveEvent, events } = props;

  return (
    <HeaderedPage>
      <Header />
      <ManagerInfo manager={manager} teams={teams} />
      <EventsList
        manager={manager}
        events={events}
        resolveEvent={resolveEvent}
      />
    </HeaderedPage>
  );
};

export default Events;
