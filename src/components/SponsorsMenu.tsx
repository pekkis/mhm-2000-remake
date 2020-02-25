import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeManager, requireManagersTeamObj } from "../services/selectors";
import HeaderedPage from "./ui/HeaderedPage";
import Header from "./Header";
import ManagerInfo from "./ManagerInfo";
import { MHMState } from "../ducks";
import { values, sortWith, ascend, prop, sortBy, descend } from "ramda";
import { SponsorshipProposal } from "../types/sponsor";
import {
  sponsorshipClausuleMap,
  getRequirementOptions
} from "../services/sponsors";
import Currency from "./ui/Currency";
import { Box } from "theme-ui";
import SelectRequirements from "./sponsors-menu/SelectRequirements";
import {
  ManagerSponsorNegotiateAction,
  MANAGER_SPONSOR_NEGOTIATE,
  MANAGER_SPONSOR_ACCEPT,
  ManagerSponsorAcceptAction
} from "../ducks/manager";
import Button from "./form/Button";

const clausuleSorter = sortWith<{
  type: string;
  amount: number;
  times: number;
  totalAmount: number;
}>([descend(prop("totalAmount"))]);

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

  const openProposals = proposals.filter(p => p.open).length;

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
        times,
        totalAmount: amount * times
      };
    })
    .filter(descriptor => descriptor.amount !== 0);

  const sortedDescriptors = clausuleSorter(clausuleDescriptors);

  return (
    <HeaderedPage>
      <Header back />
      <ManagerInfo details />

      <Box p={1}>
        <h2>
          <button
            disabled={proposalId === 0}
            onClick={() => setProposalId(proposalId - 1)}
          >
            -
          </button>
          {proposal.sponsorName}
          <button
            disabled={proposalId === proposals.length - 1}
            onClick={() => setProposalId(proposalId + 1)}
          >
            +
          </button>
        </h2>

        <SelectRequirements
          manager={manager}
          proposal={proposal}
          options={getRequirementOptions(proposal)}
        />

        <h3>Sopimuksen ehdot</h3>

        <table>
          <tbody>
            {sortedDescriptors.map((descriptor, i) => {
              return (
                <tr key={i}>
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
          </tbody>
        </table>

        <div>
          <Button
            disabled={openProposals === 1 || !proposal.open}
            onClick={() => {
              dispatch<ManagerSponsorNegotiateAction>({
                type: MANAGER_SPONSOR_NEGOTIATE,
                payload: {
                  manager: manager.id,
                  proposalId: proposal.id
                }
              });
            }}
          >
            Neuvottele
          </Button>
        </div>

        <div>
          <Button
            secondary
            disabled={!proposal.open}
            onClick={() => {
              dispatch<ManagerSponsorAcceptAction>({
                type: MANAGER_SPONSOR_ACCEPT,
                payload: {
                  manager: manager.id,
                  proposalId: proposal.id
                }
              });
            }}
          >
            Hyväksy
          </Button>
        </div>
      </Box>
    </HeaderedPage>
  );
};

export default SponsorsMenu;
