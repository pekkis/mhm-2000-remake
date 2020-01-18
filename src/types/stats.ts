export interface Streak {
  win: number;
  draw: number;
  loss: number;
  noLoss: number;
  noWin: number;
}

export interface ManagerStatistic {
  streak: Streak;
}

export interface TeamStatistic {
  ranking: number[];
  streak: Streak;
}

export interface SeasonStatistic {
  medalists: [string, string, string];
}
