import { AllCountries } from "./country";

/*
STRATEGIAT
ERIKOISTILANTEET
NEUVOTTELUTAITO
NEUVOKKUUS
KARISMA
ONNEKKUUS
*/

export interface Manager {
  id: string;
  name: string;
  country: AllCountries;
  abilities: {
    strategy: number;
    specialTeams: number;
    negotiation: number;
    cunning: number;
    charisma: number;
    luck: number;
  };
}
