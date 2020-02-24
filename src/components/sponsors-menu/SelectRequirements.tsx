import React, { FunctionComponent } from "react";
import {
  SponsorshipProposal,
  SponsorshipRequirementOptions
} from "../../types/sponsor";
import { HumanManager } from "../../types/manager";

interface Props {
  manager: HumanManager;
  options: SponsorshipRequirementOptions;
  proposal: SponsorshipProposal;
}

const SelectRequirements: FunctionComponent<Props> = ({
  proposal,
  options
}) => {
  return (
    <div>
      {["basic", "cup", "ehl"].map(req => {
        return (
          <div key={req}>
            <h2>{req}</h2>

            <select value={proposal.requirements[req]}>
              {options[req].map(option => {
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default SelectRequirements;
