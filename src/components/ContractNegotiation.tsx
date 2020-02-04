import React, { FunctionComponent } from "react";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import ManagerInfo from "./ManagerInfo";
import Box from "./styled-system/Box";
import { MHMState } from "../ducks";
import { useSelector } from "react-redux";
import Button from "./form/Button";
import Markdown from "./Markdown";
import { activeManager } from "../services/selectors";

interface Props {
  match: {
    params: {
      negotiationId: string;
    };
  };
}

const ContractNegotiation: FunctionComponent<Props> = props => {
  const negotiation = useSelector(
    (state: MHMState) =>
      state.player.negotiations[props.match.params.negotiationId]
  );

  const player = useSelector(
    (state: MHMState) => state.player.players[negotiation.player]
  );

  const manager = useSelector(activeManager);

  if (manager.id !== negotiation.manager) {
    throw new Error("OH NOES");
  }

  return (
    <HeaderedPage>
      <Header back />
      <ManagerInfo details />

      <Box p={1}>
        <h2>Sopimusneuvottelu</h2>

        <p>{JSON.stringify(negotiation)}</p>

        <p>{JSON.stringify(player)}</p>

        <Markdown source={negotiation.respond} />

        <Button disabled={!negotiation.ongoing}>Ehdota</Button>
      </Box>
    </HeaderedPage>
  );
};

export default ContractNegotiation;
