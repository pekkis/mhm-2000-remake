import type { Competition, CompetitionId } from "@/types/competitions";
import type { Arena } from "@/data/mhm2000/teams";
import type { CountryIso } from "@/data/countries";
import type { ManagerAttributes } from "@/data/managers";
import type { TeamStrength } from "@/data/levels";
import type { BudgetCategoryName, BudgetLevel } from "@/data/mhm2000/budget";
import type { GameRecord } from "@/machines/types";
import type { HiredPlayer, MarketPlayer, Player } from "@/state/player";
import type { Lineup } from "@/state/lineup";
import type { TeamServiceIdentifier } from "@/data/mhm2000/team-services";

export type { Player };

export type ManagerArena = {
  name: string;
  level: number;
};

export type Manager = HumanManager | AIManager;

export type GamesPlayedStats = Partial<
  Record<CompetitionId, Record<number, GameRecord>>
>;

export type AchievementsStat = {
  ehl: number;
  gold: number;
  silver: number;
  bronze: number;
  cup: number;
  promoted: number;
  relegated: number;
};

type BaseManager = {
  id: string;
  name: string;
  nationality: CountryIso;
  attributes: ManagerAttributes;
  team?: number;
  tags: string[];
  difficulty: number;
  stats: { games: GamesPlayedStats; achievements: AchievementsStat };
};

export type AIManager = BaseManager & {
  kind: "ai";
  difficulty: 2;
};

export type HumanManager = BaseManager & {
  kind: "human";
  difficulty: number;
  attributes: ManagerAttributes;
  balance: number;
  arena: ManagerArena;
  pranksExecuted: number;
  flags: Record<string, boolean>;
  tags: string[];
};

export type TeamEffect = {
  parameter: string[];
  amount: number | string;
  duration: number;
  extra?: Record<string, unknown>;
};

export type TeamBudget = Record<BudgetCategoryName, BudgetLevel>;

export type TeamServices = Record<TeamServiceIdentifier, number>;

type BaseTeam = {
  id: number;
  uid: string;
  name: string;
  city: string;
  arena: Arena;
  domestic: boolean;
  morale: number;
  strategy: number;
  readiness: number;
  effects: TeamEffect[];
  opponentEffects: TeamEffect[];
  manager?: string;
  tags: string[];
  tier: number;
  budget: TeamBudget;
  services: TeamServices;
  previousRankings?: [number, number, number];
  intensity: 0 | 1 | 2;
};

export type AITeam = BaseTeam & {
  kind: "ai";
  strengthObj: TeamStrength;
};

export type HumanTeam = BaseTeam & {
  kind: "human";
  /** QB `mw/pw/hw` — computed from roster by `orgamaar`; initially seeded from team tier. */
  strengthObj: TeamStrength;
  players: Record<string, HiredPlayer>;
  lineup: Lineup;
};

export type Team = HumanTeam | AITeam;

export type GameFlags = {
  jarko: boolean;
  usa: boolean;
  canada: boolean;
  haanperaMarried: boolean;
  mauto: boolean;
  psycho: string | undefined;
};

export type WorldChampionshipEntry = {
  id: string;
  name: string;
  strength: number;
  luck: number;
  random: number;
};

export type GameState = {
  turn: { season: number; round: number; phase: string | undefined };
  flags: GameFlags;
  managers: Record<string, Manager>;
  competitions: Record<CompetitionId, Competition>;
  teams: Team[];
  worldChampionshipResults: WorldChampionshipEntry[] | undefined;

  transferMarket: {
    players: Record<string, MarketPlayer>;
  };
};
