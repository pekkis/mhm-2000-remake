import React from "react";
import Markdown from "react-markdown";
import eventList from "../../data/events";

const News = props => {
  const { news } = props;

  return (
    <div>
      <h2>Uutiset</h2>

      <p>{news.count()} uutista...</p>

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
