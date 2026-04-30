import type { FC } from "react";

type AchievementsProps = {
  story: {
    medal?: number;
    mainCompetition: string;
    lastRound?: number;
    ehlChampion?: boolean;
    promoted?: boolean;
    relegated?: boolean;
  };
};

const medals: Record<number, string> = {
  0: "kulta",
  1: "hopea",
  2: "pronssi"
};

const playoffRounds: Record<string, [number, string][]> = {
  phl: [
    [1, "neljännesfinaalit"],
    [2, "semifinaali"],
    [3, "pronssiottelu"]
  ],
  division: [
    [1, "neljännesfinaalit"],
    [2, "semifinaali"],
    [3, "finaali"]
  ]
};

const Achievements: FC<AchievementsProps> = ({ story }) => {
  const achievements = [
    story.medal !== undefined && medals[story.medal],
    story.medal === undefined &&
      story.lastRound !== undefined &&
      playoffRounds[story.mainCompetition]?.[story.lastRound]?.[1],
    story.ehlChampion && "euroopan mestaruus",
    story.promoted && "sarjanousu",
    story.relegated && "putoaminen"
  ].filter((t) => t);

  return <div>{achievements.join(", ")}</div>;
};

export default Achievements;
