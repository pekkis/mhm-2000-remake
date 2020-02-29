import React, { FunctionComponent, useState } from "react";
import { HumanManager } from "../../types/manager";
import { Team } from "../../types/team";
import { SponsorshipProposal } from "../../types/sponsor";
import { useDispatch, useSelector } from "react-redux";
import { MHMState } from "../../ducks";
import { values, sortWith, ascend, descend, prop } from "ramda";
import {
  sponsorshipClausuleMap,
  getRequirementOptions
} from "../../services/sponsors";
import HeaderedPage from "../ui/HeaderedPage";
import Header from "../Header";
import ManagerInfo from "../ManagerInfo";
import { Box } from "theme-ui";
import SelectRequirements from "./SelectRequirements";
import Currency from "../ui/Currency";
import Button from "../form/Button";
import {
  ManagerSponsorAcceptAction,
  MANAGER_SPONSOR_ACCEPT,
  ManagerSponsorNegotiateAction,
  MANAGER_SPONSOR_NEGOTIATE
} from "../../ducks/manager";

interface Props {
  manager: HumanManager;
  team: Team;
}

const clausuleSorter = sortWith<{
  type: string;
  amount: number;
  times: number;
  totalAmount: number;
}>([descend(prop("totalAmount"))]);

const SponsorNegotiation: FunctionComponent<Props> = ({ manager, team }) => {
  const dispatch = useDispatch();
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

export default SponsorNegotiation;
