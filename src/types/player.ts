import { AllCountries } from "./country";

export type PlayerPosition = "g" | "d" | "lw" | "c" | "rw";

export interface Player {
  lastName: string;
  firstName: string;
  country: AllCountries;
  position: PlayerPosition;
}