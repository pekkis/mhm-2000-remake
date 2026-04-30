import type { FC } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import Paragraph from "@/components/ui/Paragraph";
import Heading from "@/components/ui/Heading";

type Props = {
  children: string;
};

// Map markdown HTML elements to our DS primitives so prose rendered
// from event/news copy picks up the same typography as the rest of
// the app. Anything not listed (em, strong, ul, li, a, …) falls back
// to react-markdown's default native element rendering.
const components: Components = {
  p: ({ children }) => <Paragraph>{children}</Paragraph>,
  h1: ({ children }) => <Heading level={1}>{children}</Heading>,
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }) => <Heading level={4}>{children}</Heading>,
  h5: ({ children }) => <Heading level={5}>{children}</Heading>,
  h6: ({ children }) => <Heading level={6}>{children}</Heading>
};

const Markdown: FC<Props> = ({ children }) => {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};

export default Markdown;
