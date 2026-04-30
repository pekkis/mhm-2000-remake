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
  managers: Record<
    string,
    { games: Record<string, Record<string, GameRecord>> }
  >;
  currentSeason: SeasonStats | undefined;
  seasons: SeasonStats[];
  streaks: {
    team: Record<string, Record<string, Streak>>;
    manager: Record<string, any>;
  };
};
