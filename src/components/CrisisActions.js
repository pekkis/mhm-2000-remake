import React from "react";
import { CRISIS_MORALE_MAX, CRISIS_DEADLINE } from "../data/constants";
import Button from "./form/Button";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import ManagerInfo from "./manager/ManagerInfo";
import MaxRound from "./ui/containers/MaxRoundContainer";

import crisis from "../data/crisis";
import { currency as c } from "../services/format";

const TransferMarket = props => {
  const { manager, teams, competitions, crisisMeeting } = props;

  const balance = manager.get("balance");
  const team = teams.get(manager.get("team"));

  const crisisInfo = crisis(team, competitions);

  return (
    <HeaderedPage>
      <Header back>
        <h2>Kriisipalaveri</h2>
      </Header>

      <MaxRound
        max={CRISIS_DEADLINE}
        fallback={
          <p>
            Tässä vaiheessa kautta on auttamatta liian myöhäistä
            kriisipalaveroida!
          </p>
        }
      >
        <ManagerInfo manager={manager} teams={teams} />

        <p>
          Kriisipalaveri auttaa joukkuetta unohtamaan tappioputken ja
          keskittymään tulevaan. Se maksaa {c(crisisInfo.get("amount"))}.
        </p>

        <Button
          block
          disabled={
            balance < crisisInfo.get("amount") ||
            team.get("morale") > CRISIS_MORALE_MAX
          }
          onClick={() => {
            crisisMeeting(manager.get("id"));
          }}
        >
          Pidä kriisipalaveri
        </Button>
      </MaxRound>
    </HeaderedPage>
  );
};

export default TransferMarket;
