import React, { useState } from "react";

import ManagerInfo from "./containers/ManagerInfoContainer";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";

import Box from "./styled-system/Box";
import Tabs from "./ui/Tabs";
import Tab from "./ui/Tab";

import ManagerStats from "./stats/ManagerStats";
import TeamStats from "./stats/TeamStats";

const Stats = props => {
  const { manager, stats, teams, competitions, countries } = props;

  const [tab, setTab] = useState(1);

  return (
    <HeaderedPage>
      <Header back />

      <ManagerInfo details />

      <Box p={1}>
        <h2>Tilastot</h2>

        <Tabs selected={tab} onSelect={setTab}>
          <Tab title="Joukkueet">
            <TeamStats
              teams={teams}
              manager={manager}
              competitions={competitions}
              stats={stats}
              countries={countries}
            />
          </Tab>

          <Tab title="Manageri">
            <ManagerStats
              manager={manager}
              competitions={competitions}
              stats={stats}
              teams={teams}
            />
          </Tab>
        </Tabs>
      </Box>
    </HeaderedPage>
  );
};

export default Stats;
