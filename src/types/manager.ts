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
  console.log("managers", manager);

  return manager.isHuman === true;
};

export interface Manager {
  id: string;
  name: string;
  country: AllCountries;
  team?: string;
  isHuman: boolean;

  abilities: {
    strategy: number;
    specialTeams: number;
    negotiation: number;
    cunning: number;
    charisma: number;
    luck: number;
  };
}

export interface ComputerManager extends Manager {
  isHuman: false;
}

export interface HumanManager extends Manager {
  isHuman: true;
  difficultyLevel: DifficultyLevels;
  pranksExecuted: number;
  balance: number;
}
