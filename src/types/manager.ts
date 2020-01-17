import { AllCountries } from "./country";
import { DifficultyLevels } from "./base";

/*
STRATEGIAT
ERIKOISTILANTEET
NEUVOTTELUTAITO
NEUVOKKUUS
KARISMA
ONNEKKUUS
*/

export const isHumanManager = (manager: Manager): manager is HumanManager => {
  return "isHuman" in manager;
};

export interface Manager {
  id: string;
  name: string;
  country: AllCountries;
  team?: string;

  abilities: {
    strategy: number;
    specialTeams: number;
    negotiation: number;
    cunning: number;
    charisma: number;
    luck: number;
  };
}

export interface HumanManager extends Manager {
  isHuman: true;
  difficultyLevel: DifficultyLevels;
  pranksExecuted: number;
  balance: number;
}
