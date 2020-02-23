import { CompetitionNames } from "./base";

export interface SponsorshipDeal {}

export interface SponsorshipProposal {
  id: string;
  sponsorName: string;
  team: string;
  competitions: CompetitionNames[];
  baseAmount: number;
  attitudeBonus: number;
  clausules: SponsorshipClausule[];
  requirements: {
    basic: 1 | 2 | 3 | 4;
    cup: 1 | 2 | 3;
    ehl: 1 | 2;
  };
  open: boolean;
}

export interface SponsorshipClausule {
  type: string;
  amount: number;
}
