import React from "react";
import ReactMarkdown from "react-markdown";
import { FunctionComponent } from "react";

interface Props {
  source: string;
}

const Markdown: FunctionComponent<Props> = ({ source }) => {
  return <ReactMarkdown source={source} />;
};

export default Markdown;
