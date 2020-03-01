import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveManager,
  requireManagersTeamObj,
  selectTeamFlag
} from "../services/selectors";
import HeaderedPage from "./ui/HeaderedPage";
import Header from "./Header";
import ManagerInfo from "./ManagerInfo";
import OrganizationBudgetForm from "./budget/OrganizationBudgetForm";
import { Box } from "theme-ui";

const BudgetOrganizationMenu = () => {
  const dispatch = useDispatch();
  const manager = useSelector(selectActiveManager);
  const team = useSelector(requireManagersTeamObj(manager.id));

  const isBudgeted: boolean = useSelector(selectTeamFlag(team.id, "budget"));

  return (
    <HeaderedPage>
      <Header back />
      <ManagerInfo details />
      <Box p={1}>
        <h2>Budjetointi</h2>

        <OrganizationBudgetForm
          team={team}
          manager={manager}
          dispatch={dispatch}
          editable={!isBudgeted}
        />
      </Box>
    </HeaderedPage>
  );
};

export default BudgetOrganizationMenu;
