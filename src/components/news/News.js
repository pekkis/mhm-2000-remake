import React from "react";
import Markdown from "react-markdown";
import eventList from "../../data/events";

const News = props => {
  const { news } = props;

  return (
    <div>
      {news.map((n, i) => {
        return (
          <div key={i}>
            <Markdown source={n} />
          </div>
        );
      })}
    </div>
  );
};

export default News;
