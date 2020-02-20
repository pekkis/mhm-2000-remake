import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeManager, requireManagersTeamObj } from "../services/selectors";
import HeaderedPage from "./ui/HeaderedPage";
import Header from "./Header";
import ManagerInfo from "./ManagerInfo";
import OrganizationBudgetForm from "./budget/OrganizationBudgetForm";
import { Box } from "theme-ui";

const BudgetOrganizationMenu = () => {
  const dispatch = useDispatch();
  const manager = useSelector(activeManager);
  const team = useSelector(requireManagersTeamObj(manager.id));

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
        />
      </Box>
    </HeaderedPage>
  );
};

export default BudgetOrganizationMenu;
