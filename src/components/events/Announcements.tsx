import Markdown from "@/components/Markdown";
import Box from "@/components/ui/Box";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Stack from "@/components/ui/Stack";
import type { FC } from "react";

type AnnouncementsProps = {
  announcements: string[];
};

const Announcements: FC<AnnouncementsProps> = ({ announcements }) => {
  return (
    <Stack gap="md">
      <Heading level={2}>Ilmoitukset</Heading>

      <Box>
        {announcements.length === 0 && <Paragraph>Ei ilmoituksia.</Paragraph>}
      </Box>
      {announcements.map((a, i) => {
        return (
          <Box key={i}>
            <Markdown>{a}</Markdown>
          </Box>
        );
      })}
    </Stack>
  );
};

export default Announcements;
