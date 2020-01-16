export const TEAM_HUMAN_CONTROLLED = "H";
export const TEAM_COMPUTER_CONTROLLED = "C";

export interface Team {
  id: string;
  name: string;
  city: string;
  level: number;
  domestic: boolean;
  morale: number;
  manager?: string;
  strength: TeamStrength;
  isHumanControlled: boolean;
}

export interface TeamStrength {
  g: number;
  d: number;
  a: number;
}
