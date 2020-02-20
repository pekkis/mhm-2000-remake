import React, { FunctionComponent } from "react";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import ManagerInfo from "./ManagerInfo";
import { Box } from "theme-ui";
import { MHMState } from "../ducks";
import { useSelector, useDispatch } from "react-redux";
import Button from "./form/Button";
import Markdown from "./Markdown";
import { activeManager } from "../services/selectors";
import ContractForm from "./contract-negotiation/ContractForm";
import {
  PlayerContractSignRequestAction,
  PLAYER_CONTRACT_SIGN_REQUEST,
  PlayerContractEndRequestAction,
  PLAYER_CONTRACT_END_REQUEST
} from "../ducks/player";

interface Props {
  match: {
    params: {
      negotiationId: string;
    };
  };
}

const ContractNegotiation: FunctionComponent<Props> = props => {
  const dispatch = useDispatch();

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

        {negotiation.respond.map((r, i) => {
          return <Markdown key={i} source={r} />;
        })}

        <ContractForm dispatch={dispatch} negotiation={negotiation} />

        <Button
          disabled={!negotiation.open}
          onClick={() => {
            dispatch<PlayerContractEndRequestAction>({
              type: PLAYER_CONTRACT_END_REQUEST,
              payload: {
                negotiationId: negotiation.id
              }
            });
          }}
        >
          Lopeta neuvottelu allekirjoittamatta sopimusta
        </Button>

        <Button
          disabled={
            negotiation.ongoing === true ||
            !negotiation.success ||
            !negotiation.open
          }
          onClick={() => {
            dispatch<PlayerContractSignRequestAction>({
              type: PLAYER_CONTRACT_SIGN_REQUEST,
              payload: {
                negotiationId: negotiation.id
              }
            });
          }}
        >
          Allekirjoita sopimus ja lopeta neuvottelu
        </Button>
      </Box>
    </HeaderedPage>
  );
};

export default ContractNegotiation;
