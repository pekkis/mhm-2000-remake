import type { FC } from "react";
import ManagerInfo from "./ManagerInfo";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import Heading from "@/components/ui/Heading";

const Players: FC = () => {
  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Heading level={2}>Pelaajat</Heading>
    </AdvancedHeaderedPage>
  );
};

export default Players;
