import React, { FunctionComponent, useState } from "react";
import { HumanManager } from "../../types/manager";
import { Team } from "../../types/team";
import { SponsorshipProposal, SponsorshipDeal } from "../../types/sponsor";
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
import TitledSelector from "../ui/TitledSelector";

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

const SponsorInformation: FunctionComponent<Props> = ({ manager, team }) => {
  const [dealId, setDealId] = useState(0);

  const allDeals = useSelector((state: MHMState) => state.sponsor.deals);
  const managersDeals = values(allDeals).filter(p => p.team === team.id);
  const deals = sortWith<SponsorshipDeal>([
    ascend(prop("weight")),
    ascend(prop("sponsorName"))
  ])(managersDeals);

  const deal: SponsorshipDeal | undefined = deals[dealId];

  const clausuleDescriptors = deal.clausules
    .map(clausule => {
      return {
        type: clausule.type,
        amount: clausule.amount,
        times: clausule.times,
        totalAmount: clausule.times * clausule.amount
      };
    })
    .filter(descriptor => descriptor.amount !== 0);

  const sortedDescriptors = clausuleSorter(clausuleDescriptors);

  return (
    <HeaderedPage>
      <Header back />
      <ManagerInfo details />

      <Box p={3}>
        <TitledSelector
          current={dealId}
          max={deals.length - 1}
          titleGetter={(deal: SponsorshipDeal) => deal.sponsorName}
          setIndex={setDealId}
          obj={deal}
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
      </Box>
    </HeaderedPage>
  );
};

export default SponsorInformation;
