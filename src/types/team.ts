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

export interface TeamOrganization {
  coaching: number;
  goalieCoaching: number;
  juniorAcademy: number;
  care: number;
  benefits: number;
}

export interface Team {
  id: string;
  name: string;
  city: string;
  level: number;
  country: AllCountries;
  isHumanControlled: boolean;
  intensity: 0 | 1 | 2;
  morale: number;
  readiness: number;
  strength: TeamStrength;
  effects: TeamEffect[];
  opponentEffects: TeamEffect[];
  manager?: string;
  strategy?: SeasonStrategies;
  organization: TeamOrganization;
}

export interface HumanControlledTeam extends Team {
  isHumanControlled: true;
}

export interface ComputerControlledTeam extends Team {
  isHumanControlled: false;
  sponsorship?: Sponsorship;
}

export interface TeamStrength {
  g: number;
  d: number;
  a: number;
  pp: number;
  pk: number;
}

export interface Sponsorship {}
