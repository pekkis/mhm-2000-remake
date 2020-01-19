import React from "react";
import EventsList from "./events/Events";
import ManagerInfo from "./containers/ManagerInfoContainer";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Box from "./styled-system/Box";

const Events = props => {
  const { manager, resolveEvent, events } = props;

  return (
    <HeaderedPage>
      <Header />
      <ManagerInfo details />

      <Box p={1}>
        <h2>Tapahtumat</h2>
        <EventsList
          manager={manager}
          events={events}
          resolveEvent={resolveEvent}
        />
      </Box>
    </HeaderedPage>
  );
};

export default Events;
