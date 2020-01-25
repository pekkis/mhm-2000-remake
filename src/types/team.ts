import { AllCountries } from "./country";
import { SeasonStrategies } from "./base";

export const TEAM_HUMAN_CONTROLLED = "H";
export const TEAM_COMPUTER_CONTROLLED = "C";

export interface TeamEffect {
  duration: number;
}

export interface TeamSpecialOps {
  fans: 0 | 1 | 2;
  beer: 0 | 1 | 2;
  doping: 0 | 1 | 2;
  travel: 0 | 1 | 2 | 3;
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
  readiness: number;
  effects: TeamEffect[];
  opponentEffects: TeamEffect[];
  intensity: 0 | 1 | 2;
}

export interface TeamStrength {
  g: number;
  d: number;
  a: number;
  pp: number;
  pk: number;
}
