import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import ManagerInfo from "./ManagerInfo";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";

const Invitations = () => {
  return (
    <AdvancedHeaderedPage
      escTo="/"
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Turnauskutsut</Heading>
        TODO, maybe?
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Invitations;
