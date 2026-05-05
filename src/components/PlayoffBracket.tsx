import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";

import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";

const PlayoffBracket = () => {
  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu back />}
    >
      <Stack gap="lg">
        <Heading level={2}>Playoffit</Heading>

        <Stack gap="md">
          Playoffs
        </Stack>

      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default PlayoffBracket;
