import { CompetitionNames } from "./base";

export interface SponsorshipDealClausule {
  type: string;
  amount: number;
  times: number;
  timesPaid: number;
}

export interface SponsorshipDeal {
  id: string;
  sponsorName: string;
  team: string;
  weight: number;
  clausules: SponsorshipDealClausule[];
}

export interface SponsorshipProposal {
  id: string;
  weight: number;
  sponsorName: string;
  team: string;
  competitions: CompetitionNames[];
  baseAmount: number;
  attitudeBonus: number;
  clausules: SponsorshipProposalClausule[];
  requirements: {
    basic: number;
    cup: number;
    ehl: number;
  };
  requirementsOpen: boolean;
  open: boolean;
  timesNegotiated: number;
}

export interface SponsorshipProposalClausule {
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
