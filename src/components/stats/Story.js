import React from "react";
import Season from "../data/Season";

const Story = props => {
  const { season, story, teams } = props;

  const t = story.get("mainCompetitionStat");
  return (
    <div>
      <h3>
        <Season long index={season} />{" "}
      </h3>

      <table border="0">
        <thead>
          <tr>
            <th>Joukkue</th>
            <th>O</th>
            <th>V</th>
            <th>TP</th>
            <th>H</th>
            <th>P</th>
            <th>TM</th>
            <th>-</th>
            <th>PM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{teams.getIn([t.get("id"), "name"])}</td>
            <td>{t.get("gamesPlayed")}</td>
            <td>{t.get("wins")}</td>
            <td>{t.get("draws")}</td>
            <td>{t.get("losses")}</td>
            <td>{t.get("points")}</td>
            <td>{t.get("goalsFor")}</td>
            <td>-</td>
            <td>{t.get("goalsAgainst")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Story;
