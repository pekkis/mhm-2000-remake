import React from "react";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import { getEffective } from "../services/effects";
import Box from "./styled-system/Box";
import { useSelector } from "react-redux";
import { MHMState, competition } from "../ducks";
import {
  allTeams,
  allManagersMap,
  allCompetitions,
  weightedCompetitions,
  allTeamsMap
} from "../services/selectors";
import { toPairs } from "ramda";

const DeveloperMenu = () => {
  const teams = useSelector(allTeamsMap);
  const managers = useSelector(allManagersMap);

  const competitions = useSelector(weightedCompetitions);

  return (
    <HeaderedPage>
      <Header back />

      <Box p={1}>
        <h2>Joukkueet</h2>

        {competitions.map(c => {
          return (
            <div key={c.id}>
              <h3>{c.name}</h3>

              <table>
                <thead>
                  <tr>
                    <th>Joukkue</th>
                    <th>Moraali</th>
                    <th>Taso</th>
                    <th>Voima</th>
                    <th>Strategia</th>
                  </tr>
                </thead>
                <tbody>
                  {c.teams
                    .map(tid => teams[tid])
                    .map(team => {
                      return (
                        <tr key={team.id}>
                          <td>{team.name}</td>
                          <td>{team.morale}</td>
                          <td>{team.level}</td>
                          <td>{JSON.stringify(team.strength)}</td>
                          <td>{team.strategy}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          );
        })}
      </Box>
    </HeaderedPage>
  );
};

export default DeveloperMenu;
