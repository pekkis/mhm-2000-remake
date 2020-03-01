import React from "react";
import EventsList from "./events/Events";
import Announcements from "./events/Announcements";
import ManagerInfo from "./ManagerInfo";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import { Box } from "theme-ui";
import { HumanManager } from "../types/manager";
import { Team } from "../types/team";
import { useSelector } from "react-redux";
import {
  selectActiveManager,
  requireHumanManagersTeamObj,
  selectCurrentTurn
} from "../services/selectors";
import { MHMState } from "../ducks";
import FinancialReport from "./accounting/FinancialReport";

const News = () => {
  const manager = useSelector(selectActiveManager);
  const team = useSelector(requireHumanManagersTeamObj(manager.id));
  const turn = useSelector(selectCurrentTurn);

  const allTransactions = useSelector(
    (state: MHMState) => state.team.accounting[team.id] || []
  );

  const transactions = allTransactions.filter(
    t => t.round === turn.round && t.season === turn.season
  );

  return (
    <HeaderedPage>
      <Header />
      <ManagerInfo details />

      <Box p={1}>
        <h2>Tapahtumat</h2>

        {/*<EventsList
          manager={manager}
          events={events}
          resolveEvent={resolveEvent}
        />
        <Announcements
          announcements={announcements.get(
            manager.get("id").toString(),
            List()
          )}
          />*/}

        <h2>Talousraportti</h2>

        <FinancialReport transactions={transactions} />
      </Box>
    </HeaderedPage>
  );
};

export default News;
