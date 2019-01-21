import React from "react";
import Season from "../data/Season";
import Achievements from "./Achievements";
import ResponsiveTable from "../responsive-table/ResponsiveTable";
import Table from "../responsive-table/Table";
import Td from "../responsive-table/Td";
import Box from "../styled-system/Box";

const Story = props => {
  const { season, story, teams, competitions } = props;

  const t = story.get("mainCompetitionStat");
  return (
    <Box my={1}>
      <h3>
        <Season long index={season} />{" "}
      </h3>

      <ResponsiveTable>
        <Table>
          <thead>
            <tr>
              <th className="fixed">Sarja</th>
              <th className="fixed">Sija</th>
              <th className="fixed">Joukkue</th>
              <th>O</th>
              <th>V</th>
              <th>TP</th>
              <th>H</th>
              <th>P</th>
              <th>ME</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="fixed">
                {competitions.getIn([story.get("mainCompetition"), "abbr"])}
              </Td>
              <Td className="fixed">{story.get("ranking") + 1}</Td>
              <Td className="fixed">{teams.getIn([t.get("id"), "name"])}</Td>
              <Td>{t.get("gamesPlayed")}</Td>
              <td>{t.get("wins")}</td>
              <td>{t.get("draws")}</td>
              <td>{t.get("losses")}</td>
              <td>{t.get("points")}</td>
              <td>{t.get("goalsFor") - t.get("goalsAgainst")}</td>
            </tr>
          </tbody>
        </Table>
      </ResponsiveTable>
      <Achievements story={story} />
    </Box>
  );
};

export default Story;
