import { AllCountries } from "./country";
import { SeasonStrategies } from "./base";

export const TEAM_HUMAN_CONTROLLED = "H";
export const TEAM_COMPUTER_CONTROLLED = "C";

export interface TeamEffect {
  duration: number;
}

export interface Team {
  id: string;
  name: string;
  city: string;
  level: number;
  country: AllCountries;
  morale: number;
  manager?: string;
  strength: TeamStrength;
  isHumanControlled: boolean;
  strategy: SeasonStrategies;
  effects: TeamEffect[];
  opponentEffects: TeamEffect[];
}

export interface TeamStrength {
  g: number;
  d: number;
  a: number;
}
