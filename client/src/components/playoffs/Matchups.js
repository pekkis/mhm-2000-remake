import React from "react";
import { matchups } from "../../services/playoffs";

const Matchups = props => {
  const { players, teams, competition, phase } = props;

  const cphase = competition.getIn(["phases", phase]);

  const matches = matchups(cphase).map(entry => {
    return {
      ...entry,
      playerControlled: players.map(p => p.get("team")).includes(entry.id)
    };
  });

  return (
    <table>
      <tbody>
        {matches.map(m => {
          console.log("m", m);

          return (
            <tr>
              <td>{teams.getIn([m.home.id, "name"])}</td>
              <td>-</td>
              <td>{teams.getIn([m.away.id, "name"])}</td>
              <td>
                {m.home.wins}-{m.away.wins}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Matchups;
