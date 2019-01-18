import React from "react";
import { List, Map } from "immutable";

const TeamStats = props => {
  const { competitions, manager, stats } = props;
  return (
    <div>
      {List.of("phl", "division", "ehl")
        .map(c => competitions.get(c))
        .map(c => {
          const stat = stats.getIn(
            ["managers", manager.get("id"), "games", c.get("id"), "0"],
            Map({
              win: 0,
              draw: 0,
              loss: 0
            })
          );

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
    </div>
  );
};

export default TeamStats;
