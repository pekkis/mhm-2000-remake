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

export interface PlayerPerkService {
  label: string;
  addToPlayer: (player: Player) => Player;
}

export type PlayerPerkNames =
  | "leader"
  | "tikitalk"
  | "weirdo"
  | "fatso"
  | "enforcer"
  | "samba"
  | "haminator"
  | "surfer"
  | "unpredictable"
  | "pappaBetalar"
  | "dynamicDuo"
  | "agitator"
  | "zombie";

export interface Injury {
  duration: number;
}

export interface Suspension {
  duration: number;
}

export interface Absence {
  duration: number;
  type: string;
}

export interface PlayerEffect {
  type: string;
  duration: number;
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
  perks: PlayerPerkNames[];
  energy: number;
  injury?: Injury;
  absence?: Absence;
  suspension?: Suspension;
  effects: PlayerEffect[];
}
