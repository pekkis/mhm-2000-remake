import React from "react";

import Events from "./events/Events";
import News from "./news/News";
import Situation from "./context-sensitive/Situation";
import ManagerInfo from "./containers/ManagerInfoContainer";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Button from "./form/Button";

import BettingForm from "./championship-betting/BettingForm";

import { Box } from "theme-ui";

const Gala = props => {
  const { teams, competitions, advance, betChampion, manager, news } = props;

  return (
    <HeaderedPage>
      <Header forward="Jo riittää lätinä, asiaan!" />

      <Box p={1}>
        <h2>Loppuottelugaala</h2>

        <News news={news} />
      </Box>
    </HeaderedPage>
  );
};

export default Gala;
