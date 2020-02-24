import { CompetitionNames } from "./base";

export interface SponsorshipDeal {}

export interface SponsorshipProposal {
  id: string;
  weight: number;
  sponsorName: string;
  team: string;
  competitions: CompetitionNames[];
  baseAmount: number;
  attitudeBonus: number;
  clausules: SponsorshipClausule[];
  requirements: {
    basic: 0 | 1 | 2 | 3;
    cup: 0 | 1 | 2;
    ehl: 0 | 1;
  };
  open: boolean;
}

export interface SponsorshipClausule {
  type: string;
  multiplier: number;
  amount?: number;
}

export interface SponsorshipRequirementOptions {
  basic: number[];
  cup: number[];
  ehl: number[];
}
