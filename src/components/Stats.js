import React from "react";

import Events from "./events/Events";
import News from "./news/News";
import Situation from "./context-sensitive/Situation";
import ManagerInfo from "./containers/ManagerInfoContainer";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Forward from "./context-sensitive/containers/ForwardContainer";
import { List, Map } from "immutable";

import Box from "./styled-system/Box";

const Stats = props => {
  const { manager, stats, teams, competitions } = props;

  console.log("stats", stats.toJS());

  return (
    <HeaderedPage>
      <Header menu forward={<Forward />} />

      <ManagerInfo details />

      <Box p={1}>
        <h2>Tilastot</h2>

        {List.of("phl", "division", "ehl")
          .map(c => competitions.get(c))
          .map(c => {
            const stat = stats.getIn(
              ["managers", manager.get("id"), "games", c.get("id"), 0],
              Map({
                win: 0,
                draw: 0,
                loss: 0
              })
            );

            console.log(stat.toJS());

            return (
              <div key={c}>
                <h3>{c.get("name")}</h3>

                <table>
                  <tbody>
                    <tr>
                      <th>Otteluita</th>
                      <td>{stat.reduce((r, s) => r + s, 0)}</td>
                    </tr>
                    <tr>
                      <th>Voittoja</th>
                      <td>{stat.get("win")}</td>
                    </tr>
                    <tr>
                      <th>Tasapelejä</th>
                      <td>{stat.get("draw")}</td>
                    </tr>
                    <tr>
                      <th>Tappioita</th>
                      <td>{stat.get("loss")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
      </Box>
    </HeaderedPage>
  );
};

export default Stats;
