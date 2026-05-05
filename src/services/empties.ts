import type { SeasonStats } from "@/state";
import type { AchievementsStat } from "@/state/game";

export const emptyAchievements = (): AchievementsStat => {
  return {
    gold: 0,
    silver: 0,
    bronze: 0,
    ehl: 0,
    cup: 0,
    promoted: 0,
    relegated: 0
  };
};

export const emptySeasonStat = (): SeasonStats => {
  return {
    ehlChampion: undefined,
    medalists: [],
    presidentsTrophy: undefined,
    promoted: {
      division: [],
      mutasarja: []
    },
    relegated: {
      phl: [],
      division: []
    },
    worldChampionships: undefined,
    stories: {}
  } satisfies SeasonStats;
};
