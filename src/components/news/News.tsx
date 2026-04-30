import Markdown from "@/components/Markdown";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";
import type { FC } from "react";

type NewsProps = {
  news: string[];
  manager?: unknown;
};

const News: FC<NewsProps> = ({ news }) => {
  return (
    <Stack>
      {news.map((n, i) => {
        return (
          <Box key={i}>
            <Markdown>{n}</Markdown>
          </Box>
        );
      })}
    </Stack>
  );
};

export default News;
