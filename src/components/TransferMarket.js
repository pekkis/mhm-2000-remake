import React, { useState } from "react";
import playerTypes from "../data/transfer-market";
import Button from "./form/Button";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Calendar from "./ui/containers/CalendarContainer";
import { currency } from "../services/format";
import ManagerInfo from "./containers/ManagerInfoContainer";
import Box from "./styled-system/Box";
import Tabs from "./ui/Tabs";
import Tab from "./ui/Tab";

const TransferMarket = props => {
  const { manager, buyPlayer, sellPlayer } = props;

  const balance = manager.get("balance");
  const [tab, setTab] = useState(0);

  return (
    <HeaderedPage>
      <Header back />

      <ManagerInfo details />

      <Box p={1}>
        <h2>Pelaajamarkkinat</h2>

        <Calendar
          when={c => c.get("transferMarket")}
          fallback={
            <p>
              Valitettavasti siirtoaika on umpeutunut. Tervetuloa takaisin ensi
              vuonna!
            </p>
          }
        >
          <Tabs selected={tab} onSelect={setTab}>
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
        </Calendar>
      </Box>
    </HeaderedPage>
  );
};

export default TransferMarket;
