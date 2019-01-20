import React from "react";

import Events from "./events/Events";
import News from "./news/News";
import Situation from "./context-sensitive/Situation";
import ManagerInfo from "./containers/ManagerInfoContainer";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Button from "./form/Button";

import BettingForm from "./betting/BettingForm";

import Box from "./styled-system/Box";

const Betting = props => {
  const { teams, competition, bet, manager, turn } = props;

  return (
    <HeaderedPage>
      <Header back />

      <ManagerInfo details />

      <Box p={1}>
        <h2>Kavioveikkaus</h2>

        <p>Puuppa.</p>

        <BettingForm
          turn={turn}
          teams={teams}
          manager={manager}
          bet={bet}
          competition={competition}
        />
      </Box>
    </HeaderedPage>
  );
};

export default Betting;
