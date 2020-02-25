import { CompetitionNames } from "./base";

export interface SponsorshipDeal {
  id: string;
  sponsorName: string;
  clausules: SponsorshipClausule;
}

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
    basic: number;
    cup: number;
    ehl: number;
  };
  requirementsOpen: boolean;
  open: boolean;
  timesNegotiated: number;
}

export interface SponsorshipClausule {
  type: string;
  multiplier: number;
  amount?: number;
}

export interface SponsorshipRequirementOption {
  key: string;
  label: string;
  options: {
    key: number;
    label: string;
  }[];
}
