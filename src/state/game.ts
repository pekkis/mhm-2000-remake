import type { Competition, CompetitionId } from "@/types/competitions";
import type { Arena } from "@/data/mhm2000/teams";
import type { CountryIso } from "@/data/countries";
import type { ManagerAttributes } from "@/data/managers";
import type { TeamStrength } from "@/data/levels";
import type { BudgetCategoryName, BudgetLevel } from "@/data/mhm2000/budget";

/* The free players in the player market */
export type BorssiPlayer = {};

/* Actual, hired players in a team */
export type Player = {};

/* the "players" of AI teams */
export type AITeamMockPlayer = {};

export type ManagerArena = {
  name: string;
  level: number;
};

export type ManagerServices = {
  coach: boolean;
  insurance: boolean;
  microphone: boolean;
  cheer: boolean;
};

export type Manager = HumanManager | AIManager;

type BaseManager = {
  id: string;
  name: string;
  nationality: CountryIso;
  attributes: ManagerAttributes;
  team?: number;
  tags: string[];
  difficulty: number;
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
  services: ManagerServices;
  pranksExecuted: number;
  extra: number;
  insuranceExtra: number;
  flags: Record<string, boolean>;
  tags: string[];
};

export type TeamEffect = {
  parameter: string[];
  amount: number | string;
  duration: number;
  extra?: Record<string, unknown>;
};

type TeamBudget = Record<BudgetCategoryName, BudgetLevel>;

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
  budget?: TeamBudget;
  previousRankings?: [number, number, number];
};

export type AITeam = BaseTeam & {
  kind: "ai";
  strengthObj: TeamStrength;
};

export type HumanTeam = BaseTeam & {
  kind: "human";
  players: Record<string, Player>;
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
  serviceBasePrices: Record<string, number>;
  managers: Record<string, Manager>;
  competitions: Record<CompetitionId, Competition>;
  teams: Team[];
  worldChampionshipResults: WorldChampionshipEntry[] | undefined;
};
