import React from "react";
import { useSelector } from "react-redux";
import {
  selectActiveManager,
  requireManagersTeamObj,
  selectTeamFlag
} from "../services/selectors";
import SponsorInformation from "./sponsors-menu/SponsorInformation";
import SponsorNegotiation from "./sponsors-menu/SponsorNegotiation";

const SponsorsMenu = () => {
  const manager = useSelector(selectActiveManager);
  const team = useSelector(requireManagersTeamObj(manager.id));

  const hasNegotiated: boolean | undefined = useSelector(
    selectTeamFlag(team.id, "sponsor")
  );

  if (!hasNegotiated) {
    return <SponsorNegotiation manager={manager} team={team} />;
  } else {
    return <SponsorInformation manager={manager} team={team} />;
  }
};

export default SponsorsMenu;
