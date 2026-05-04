import type { CompetitionId } from "@/machines/types";

export type Streak = {
  win: number;
  draw: number;
  loss: number;
  noLoss: number;
  noWin: number;
};

export type GameRecord = {
  win: number;
  draw: number;
  loss: number;
};

export type SeasonStats = {
  ehlChampion: number | undefined;
  presidentsTrophy: number | undefined;
  medalists: number[] | undefined;
  worldChampionships: any[] | undefined;
  promoted: number | undefined;
  relegated: number | undefined;
  stories: Record<string, any>;
};

export type StatsState = {
  currentSeason: SeasonStats | undefined;
  seasons: SeasonStats[];
  streaks: {
    team: Record<number, Partial<Record<CompetitionId, Streak>>>;
    manager: Record<string, Partial<Record<CompetitionId, Streak>>>;
  };
};
