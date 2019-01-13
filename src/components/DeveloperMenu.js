import React from "react";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import { getEffective } from "../services/effects";
import Box from "./styled-system/Box";

const DeveloperMenu = props => {
  const { teams, competitions } = props;

  return (
    <HeaderedPage>
      <Header back />

      <Box p={1}>
        <h2>Devausinfo</h2>

        {competitions
          .map(c => {
            return (
              <div key={c.get("id")}>
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
      </Box>
    </HeaderedPage>
  );
};

export default DeveloperMenu;
