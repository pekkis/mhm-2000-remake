import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeManager, requireManagersTeamObj } from "../services/selectors";
import HeaderedPage from "./ui/HeaderedPage";
import Header from "./Header";
import ManagerInfo from "./ManagerInfo";

const BudgetOrganizationMenu = () => {
  const dispatch = useDispatch();
  const manager = useSelector(activeManager);
  const team = useSelector(requireManagersTeamObj(manager.id));

  return (
    <HeaderedPage>
      <Header back />
      <ManagerInfo details />
    </HeaderedPage>
  );
};

export default BudgetOrganizationMenu;
