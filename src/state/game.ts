import type { Competition, CompetitionId } from "@/types/competitions";
import type { Arena } from "@/data/mhm2000/teams";
import type { CountryIso } from "@/data/countries";
import type { ManagerAttributes } from "@/data/managers";

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

export type AIManager = {
  id: string;
  kind: "ai";
  name: string;
  nationality: CountryIso;
  attributes: ManagerAttributes;
  team?: number;
  tags: string[];
  difficulty: 2;
};

export type HumanManager = {
  id: string;
  kind: "human";
  name: string;
  nationality: CountryIso;
  difficulty: number;
  attributes: ManagerAttributes;
  team?: number;
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

export type Team = {
  id: number;
  uid: string;
  name: string;
  city: string;
  arena: Arena;
  strength: number;
  domestic: boolean;
  morale: number;
  strategy: number;
  readiness: number;
  effects: TeamEffect[];
  opponentEffects: TeamEffect[];
  manager?: string;
  tags: string[];
};

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
