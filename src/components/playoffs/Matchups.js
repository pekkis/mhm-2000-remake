import React from "react";

const Matchups = props => {
  const { players, teams, group } = props;

  console.log(group.toJS(), "group");

  const matches = group.get("stats").map(entry => {
    return entry.set(
      "playerController",
      players.map(p => p.get("team")).includes(entry.get("id"))
    );
  });

  return (
    <table>
      <tbody>
        {matches.map((m, i) => {
          return (
            <tr key={i}>
              <td>{teams.getIn([m.getIn(["home", "id"]), "name"])}</td>
              <td>-</td>
              <td>{teams.getIn([m.getIn(["away", "id"]), "name"])}</td>
              <td>
                {m.getIn(["home", "wins"])}-{m.getIn(["away", "wins"])}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Matchups;
