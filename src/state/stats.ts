import type { CompetitionId } from "@/types/competitions";
import type { TeamStat } from "@/types/competitions";

export type SeasonStory = {
  mainCompetition: CompetitionId;
  mainCompetitionStat: TeamStat;
  ranking: number;
  promoted: boolean;
  relegated: boolean;
  medal: number;
  ehlChampion: boolean;
  lastPhase: number;
};

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
  promoted: {
    mutasarja: number[];
    division: number[];
  };
  relegated: {
    phl: number[];
    division: number[];
  };
  stories: Record<string, SeasonStory>;
};

export type StatsState = {
  currentSeason: SeasonStats | undefined;
  seasons: SeasonStats[];
  streaks: {
    team: Record<number, Partial<Record<CompetitionId, Streak>>>;
    manager: Record<string, Partial<Record<CompetitionId, Streak>>>;
  };
};
