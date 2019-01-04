import React from "react";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import { getEffective } from "../services/effects";

const DeveloperMenu = props => {
  const { teams, competitions } = props;

  return (
    <HeaderedPage>
      <Header back />
      {competitions
        .map(c => {
          return (
            <div>
              <h2>{c.get("name")}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Joukkue</th>
                    <th>O-voima</th>
                    <th>E-voima</th>
                    <th>E-moraali</th>
                    <th>E-valmius</th>
                  </tr>
                </thead>

                <tbody>
                  {c
                    .get("teams")
                    .sortBy(t => -teams.get(t).get("strength"))
                    .map(t => {
                      const team = teams.get(t);
                      const e = getEffective(team);

                      return (
                        <tr key={team.get("id")}>
                          <td>{team.get("name")}</td>
                          <td>{team.get("strength")}</td>
                          <td>{e.get("strength")}</td>
                          <td>{e.get("morale")}</td>
                          <td>{e.get("readiness")}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          );
        })
        .toList()}
    </HeaderedPage>
  );
};

export default DeveloperMenu;
