import React from "react";

import ManagerInfo from "./containers/ManagerInfoContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Button from "./form/Button";

import BettingForm from "./championship-betting/BettingForm";

import Box from "./styled-system/Box";

const ChampionshipBetting = props => {
  const { teams, competitions, advance, betChampion, manager } = props;

  return (
    <HeaderedPage>
      <ManagerInfo />

      <Box p={1}>
        <h2>Mestariveikkaus</h2>

        <p>
          On vuosittaisen <strong>mestariveikkauksen aika</strong>. Tässä
          ehdokkaat ja heidän kertoimensa.
        </p>

        <BettingForm
          manager={manager}
          betChampion={betChampion}
          competition={competitions.get("phl")}
          teams={teams}
        />

        <Button secondary block onClick={() => advance()}>
          En halua veikata
        </Button>
      </Box>
    </HeaderedPage>
  );
};

export default ChampionshipBetting;
