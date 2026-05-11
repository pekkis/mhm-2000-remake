import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import ManagerInfo from "./ManagerInfo";
import Stack from "@/components/ui/Stack";

const Arenas = () => {
  return (
    <AdvancedHeaderedPage
      escTo="/"
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">Ho haa!</Stack>
    </AdvancedHeaderedPage>
  );
};

export default Arenas;
