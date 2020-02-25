import React, { FunctionComponent } from "react";
import {
  SponsorshipProposal,
  SponsorshipRequirementOption
} from "../../types/sponsor";
import { HumanManager } from "../../types/manager";
import { useDispatch } from "react-redux";
import {
  MANAGER_SPONSOR_SET_REQUIREMENT,
  ManagerSponsorSetRequirementAction
} from "../../ducks/manager";
import { Flex, Box, Select } from "theme-ui";

interface Props {
  manager: HumanManager;
  options: SponsorshipRequirementOption[];
  proposal: SponsorshipProposal;
}

const SelectRequirements: FunctionComponent<Props> = ({
  proposal,
  options,
  manager
}) => {
  const dispatch = useDispatch();

  return (
    <div>
      <h3>Menestystavoitteet</h3>

      <Flex p={1}>
        {options
          .filter(o => o.options.length !== 0)
          .map(req => {
            return (
              <Box p={0} sx={{ flex: "1 1 auto" }} key={req.key}>
                <h2>{req.label}</h2>

                <Select
                  disabled={!proposal.requirementsOpen}
                  p={0}
                  onChange={e => {
                    console.log("oh noes", e);

                    dispatch<ManagerSponsorSetRequirementAction>({
                      type: MANAGER_SPONSOR_SET_REQUIREMENT,
                      payload: {
                        manager: manager.id,
                        proposalId: proposal.id,
                        requirement: req.key as "basic" | "cup" | "ehl",
                        value: parseInt(e.currentTarget.value, 10)
                      }
                    });
                  }}
                  value={proposal.requirements[req.key]}
                >
                  {req.options.map(option => {
                    return (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    );
                  })}
                </Select>
              </Box>
            );
          })}
      </Flex>
    </div>
  );
};

export default SelectRequirements;
