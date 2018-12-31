import React from "react";
import { matchups } from "../../services/playoffs";

const Matchups = props => {
  const { players, teams, group } = props;

  console.log(group.toJS(), "group");

  const matches = matchups(group).map(entry => {
    return {
      ...entry,
      playerControlled: players.map(p => p.get("team")).includes(entry.id)
    };
  });

  return (
    <table>
      <tbody>
        {matches.map((m, i) => {
          return (
            <tr key={i}>
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
