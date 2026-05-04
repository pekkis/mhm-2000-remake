import type { AchievementsStat } from "@/state/game";

export const emptyAchievements = (): AchievementsStat => {
  return {
    gold: 0,
    silver: 0,
    bronze: 0,
    fourth: 0,
    ehlChampion: 0,
    presidentsTrophy: 0,
    promoted: 0,
    relegated: 0
  };
};
