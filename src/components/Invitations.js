import React from "react";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import ManagerInfo from "./containers/ManagerInfoContainer";
import Box from "./styled-system/Box";
import tournamentList from "../data/tournaments";
import Markdown from "react-markdown";
import Button from "./form/Button";

const Invitations = props => {
  const { manager, invitations, acceptInvitation } = props;

  return (
    <HeaderedPage>
      <Header back />

      <ManagerInfo details />

      <Box p={1}>
        <h2>Turnauskutsut</h2>

        {invitations.map((i, index) => {
          const t = tournamentList.get(i.get("tournament"));
          return (
            <div key={index}>
              <h3>{t.get("name")}</h3>

              <Markdown source={t.get("description")(t.get("award"))} />

              <Button
                block
                onClick={() => acceptInvitation(manager.get("id"), i.get("id"))}
                disabled={i.get("participate")}
              >
                Hyväksy turnauskutsu
              </Button>
            </div>
          );
        })}
      </Box>
    </HeaderedPage>
  );
};

export default Invitations;
