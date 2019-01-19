import React from "react";
import Season from "../data/Season";
import Achievements from "./Achievements";

const Story = props => {
  const { season, story, teams, competitions } = props;

  console.log("story", story.toJS());

  const t = story.get("mainCompetitionStat");
  return (
    <div>
      <h3>
        <Season long index={season} />{" "}
      </h3>

      <table border="0">
        <thead>
          <tr>
            <th>Sarja</th>
            <th>Sija</th>
            <th>Joukkue</th>
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
            <td>
              {competitions.getIn([story.get("mainCompetition"), "abbr"])}
            </td>
            <td>{story.get("ranking") + 1}</td>
            <td>{teams.getIn([t.get("id"), "name"])}</td>
            <td>{t.get("gamesPlayed")}</td>
            <td>{t.get("wins")}</td>
            <td>{t.get("draws")}</td>
            <td>{t.get("losses")}</td>
            <td>{t.get("points")}</td>
            <td>{t.get("goalsFor") - t.get("goalsAgainst")}</td>
          </tr>
        </tbody>
      </table>
      <Achievements story={story} />
    </div>
  );
};

export default Story;
