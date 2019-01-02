import React from "react";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";

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
                    <th>Voima</th>
                  </tr>
                </thead>

                <tbody>
                  {c
                    .get("teams")
                    .sortBy(t => -teams.get(t).get("strength"))
                    .map(t => {
                      return (
                        <tr key={t}>
                          <td>{teams.get(t).get("name")}</td>
                          <td>{teams.get(t).get("strength")}</td>
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
