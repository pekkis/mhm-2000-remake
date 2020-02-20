import React from "react";
import strategies, { weightedStrategyList } from "../services/strategies";
import Button from "./form/Button";
import { Box } from "theme-ui";
import { useDispatch, useSelector } from "react-redux";
import {
  activeManager,
  managersTeam,
  requireManagersTeamObj
} from "../services/selectors";
import { SeasonStrategies } from "../types/base";
import { selectStrategy } from "../ducks/manager";
import HeaderedPage from "./ui/HeaderedPage";
import Header from "./Header";
import ManagerInfo from "./ManagerInfo";
import Markdown from "./Markdown";

const SelectStrategy = () => {
  const dispatch = useDispatch();
  const manager = useSelector(activeManager);
  const team = useSelector(requireManagersTeamObj(manager.id));

  return (
    <HeaderedPage>
      <Header back />
      <ManagerInfo details />

      {!team.strategy && (
        <Box p={1}>
          <h2>Valitse valmennusstrategia alkavalle kaudelle</h2>

          {weightedStrategyList.map(strategy => {
            return (
              <div key={strategy.id}>
                <h3>{strategy.name}</h3>

                <Markdown source={strategy.description} />

                <p>
                  <Button
                    block
                    onClick={() => {
                      dispatch(
                        selectStrategy(
                          manager.id,
                          strategy.id as SeasonStrategies
                        )
                      );
                    }}
                  >
                    Valitse strategia "{strategy.name}"
                  </Button>
                </p>
              </div>
            );
          })}
        </Box>
      )}

      {team.strategy && (
        <Box p={1}>
          <h2>Valitsemasi valmennusstrategia kuluvalle kaudelle</h2>

          <h3>{strategies[team.strategy].name}</h3>

          <Markdown source={strategies[team.strategy].description} />
        </Box>
      )}
    </HeaderedPage>
  );
};

export default SelectStrategy;
