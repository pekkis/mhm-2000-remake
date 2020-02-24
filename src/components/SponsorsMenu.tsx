import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeManager, requireManagersTeamObj } from "../services/selectors";
import HeaderedPage from "./ui/HeaderedPage";
import Header from "./Header";
import ManagerInfo from "./ManagerInfo";
import { MHMState } from "../ducks";
import { values, sortWith, ascend, prop } from "ramda";
import { SponsorshipProposal } from "../types/sponsor";
import {
  sponsorshipClausuleMap,
  getRequirementOptions
} from "../services/sponsors";
import Currency from "./ui/Currency";
import { Box } from "theme-ui";
import SelectRequirements from "./sponsors-menu/SelectRequirements";

const SponsorsMenu = () => {
  const dispatch = useDispatch();
  const manager = useSelector(activeManager);
  const team = useSelector(requireManagersTeamObj(manager.id));

  const [proposalId, setProposalId] = useState(0);

  const allProposals = useSelector(
    (state: MHMState) => state.sponsor.proposals
  );
  const managersProposals = values(allProposals).filter(
    p => p.team === team.id
  );
  const proposals = sortWith<SponsorshipProposal>([ascend(prop("weight"))])(
    managersProposals
  );

  console.log("proposals", proposals);

  const proposal: SponsorshipProposal | undefined = proposals[proposalId];

  if (!proposal) {
    return "nope";
  }

  const clausuleDescriptors = proposal.clausules
    .map(clausule => {
      const amount =
        sponsorshipClausuleMap[clausule.type].getAmount(proposal) *
        clausule.multiplier;

      const times = sponsorshipClausuleMap[clausule.type].getTimes();

      return {
        type: clausule.type,
        amount,
        times
      };
    })
    .filter(descriptor => descriptor.amount !== 0);

  return (
    <HeaderedPage>
      <Header back />
      <ManagerInfo details />

      <Box p={1}>
        <h2>
          <button onClick={() => setProposalId(proposalId - 1)}>-</button>
          {proposal.sponsorName}
          <button onClick={() => setProposalId(proposalId + 1)}>+</button>
        </h2>

        <table>
          {clausuleDescriptors.map(descriptor => {
            return (
              <tr>
                <td>{sponsorshipClausuleMap[descriptor.type].title}</td>
                <td>
                  {<Currency value={descriptor.amount} />}
                  {descriptor.times > 1 && (
                    <div>
                      <small>
                        yhteensä{" "}
                        <Currency
                          value={descriptor.amount * descriptor.times}
                        />
                      </small>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </table>

        <SelectRequirements
          manager={manager}
          proposal={proposal}
          options={getRequirementOptions(proposal)}
        />
      </Box>
    </HeaderedPage>
  );
};

export default SponsorsMenu;
