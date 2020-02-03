import { AllCountries } from "./country";

export type PlayerPosition = "g" | "d" | "lw" | "c" | "rw";

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
