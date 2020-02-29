import React, { FunctionComponent } from "react";
import { HumanManager } from "../../types/manager";
import { Team } from "../../types/team";

interface Props {
  manager: HumanManager;
  team: Team;
}

const SponsorInformation: FunctionComponent<Props> = ({ manager, team }) => {
  return <div>HELLUREI</div>;
};

export default SponsorInformation;
