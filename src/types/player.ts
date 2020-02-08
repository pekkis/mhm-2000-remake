import { AllCountries } from "./country";
import { Turn } from "./base";

export type PlayerPosition = "g" | "d" | "lw" | "c" | "rw";

export interface Contract {
  team: string;
  salary: number;
  years: number;
  yearsLeft: number;
  nhlOption: boolean;
  freeKickOption: boolean;
}

export interface ContractNegotiation {
  id: string;
  open: boolean;
  turn: Turn;
  manager: string;
  player: string;
  patience: number;
  proposalsMade: number;
  ongoing: boolean;
  success?: boolean;
  contract: Contract;
  respond: string[];
  organizationOpinion: number;
  context: string;
}

export interface Player {
  id: string;
  lastName: string;
  firstName: string;
  country: AllCountries;
  skill: number;
  position: PlayerPosition;
  age: number;
  ego: number;
  leadership: number;
  charisma: number;
  pk: number;
  pp: number;
  contract?: Contract;
}
