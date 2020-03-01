import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import PlayerName from "../ui/PlayerName";
import { useDispatch, useSelector } from "react-redux";
import Button from "../form/Button";
import { selectActiveManager } from "../../services/selectors";
import { PLAYER_CONTRACT_INITIATE_REQUEST } from "../../ducks/player";

interface Props {
  player: Player;
}

const PlayerInfo: FunctionComponent<Props> = ({ player }) => {
  const dispatch = useDispatch();
  const manager = useSelector(selectActiveManager);

  return (
    <div>
      <h2>
        Pelaajamarkkinat > <PlayerName player={player} />
      </h2>

      {!player.contract && (
        <Button
          onClick={() => {
            dispatch({
              type: PLAYER_CONTRACT_INITIATE_REQUEST,
              payload: {
                manager: manager.id,
                player: player.id,
                context: "transferMarket"
              }
            });
          }}
        >
          Neuvottele!
        </Button>
      )}
    </div>
  );
};

export default PlayerInfo;
