import type { Competition, CompetitionId } from "@/types/competitions";
import type { Arena } from "@/data/mhm2000/teams";
import type { Manager } from "@/state/manager";

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
};

export type GameFlags = {
  jarko: boolean;
  usa: boolean;
  canada: boolean;
  haanperaMarried: boolean;
  mauto: boolean;
  psycho: number | undefined;
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
