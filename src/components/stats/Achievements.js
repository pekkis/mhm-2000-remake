import React from "react";
import { Map, List } from "immutable";

const medals = Map([[0, "kulta"], [1, "hopea"], [0, "pronssi"]]);

const playoffRounds = Map({
  phl: [[1, "neljännesfinaalit"], [2, "semifinaali"], [3, "pronssiottelu"]],
  division: [[1, "neljännesfinaalit"], [2, "semifinaali"], [3, "finaali"]]
});

const Achievements = props => {
  const { story } = props;

  const achievements = List.of(
    medals.get(story.get("medal")),
    !medals.get(story.get("medal")) &&
      playoffRounds.getIn([
        story.get("mainCompetition"),
        story.get("lastRound")
      ]),
    story.get("ehlChampion") && "euroopan mestaruus",
    story.get("promoted") && "sarjanousu",
    story.get("relegated") && "putoaminen"
  ).filter(t => t);

  return <div>{achievements.join(", ")}</div>;
};

export default Achievements;
