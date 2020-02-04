import { AllCountries } from "./country";
import { Turn } from "./base";

export type PlayerPosition = "g" | "d" | "lw" | "c" | "rw";

export interface Contract {
  salary: number;
  years: number;
  nhlOption: boolean;
  freeKickOption: boolean;
}

export interface ContractNegotiation {
  id: string;
  turn: Turn;
  manager: string;
  player: string;
  ongoing: boolean;
  success?: boolean;
  contract: Contract;
  respond: string;
  exitTo?: string;
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
}
