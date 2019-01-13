import React from "react";
import playerTypes from "../data/transfer-market";
import Button from "./form/Button";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import MaxRound from "./ui/containers/MaxRoundContainer";
import { currency } from "../services/format";
import { TRANSFER_DEADLINE } from "../data/constants";
import ManagerInfo from "./containers/ManagerInfoContainer";
import Box from "./styled-system/Box";
import Tabs from "./ui/Tabs";
import Tab from "./ui/Tab";

const TransferMarket = props => {
  const { manager, teams, buyPlayer, sellPlayer, tab, selectTab } = props;

  const balance = manager.get("balance");

  const team = teams.get(manager.get("team"));

  return (
    <HeaderedPage>
      <Header back />

      <ManagerInfo />

      <Box p={1}>
        <h2>Pelaajamarkkinat</h2>

        <MaxRound
          max={TRANSFER_DEADLINE}
          fallback={
            <p>
              Valitettavasti siirtoaika on umpeutunut. Tervetuloa takaisin ensi
              vuonna!
            </p>
          }
        >
          <Tabs
            selected={tab}
            onSelect={selected => {
              selectTab("transferMarket", selected);
            }}
          >
            <Tab title="Osta pelaajia">
              <div>
                {playerTypes.map((playerType, index) => {
                  return (
                    <div key={index}>
                      <Button
                        onClick={() => {
                          buyPlayer(manager.get("id"), index);
                        }}
                        block
                        disabled={balance < playerType.get("buy")}
                      >
                        <div>{playerType.get("description")}</div>
                        <div>
                          <strong>{currency(playerType.get("buy"))}</strong>
                        </div>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Tab>
            <Tab title="Myy pelaajia">
              <div>
                {playerTypes.map((playerType, index) => {
                  return (
                    <div key={index}>
                      <Button
                        onClick={() => {
                          sellPlayer(manager.get("id"), index);
                        }}
                        block
                      >
                        <div>{playerType.get("description")}</div>
                        <div>
                          <strong>{currency(playerType.get("sell"))}</strong>
                        </div>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Tab>
          </Tabs>
        </MaxRound>
      </Box>
    </HeaderedPage>
  );
};

export default TransferMarket;
