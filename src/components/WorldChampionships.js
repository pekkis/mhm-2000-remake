import React from "react";

import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";

import Box from "./styled-system/Box";

/*
IF tuurix(tux) > 15 THEN COLOR 13, 0: PRINT lw(tux); " pelasi koko turnauksen ajan todella suurella syd„mell„!": franko = franko + 1
IF tuurix(tux) < -15 THEN COLOR 5, 0: PRINT lw(tux); " k„rsi koko turnauksen ajan suurista ongelmista!": franko = franko + 1
*/

const WorldChampionships = props => {
  const { results, turn } = props;

  return (
    <HeaderedPage>
      <Header forward="Palkintogaala" />

      <Box p={1}>
        <h2>Maailmanmestaruuskisat {turn.get("season") + 1}</h2>

        <div>
          {results
            .filter(e => e.get("luck") > 0)
            .map(e => {
              return (
                <p key={e.get("id")}>
                  <strong>{e.get("name")}</strong> pelasi koko turnauksen ajan
                  todella suurella sydämellä!
                </p>
              );
            })}
          {results
            .filter(e => e.get("luck") < 0)
            .map(e => {
              return (
                <p key={e.get("id")}>
                  <strong>{e.get("name")}</strong> kärsi koko turnauksen ajan
                  suurista ongelmista!
                </p>
              );
            })}
        </div>

        <ol>
          {results.map(entry => {
            return <li key={entry.get("id")}>{entry.get("name")}</li>;
          })}
        </ol>
      </Box>
    </HeaderedPage>
  );
};

export default WorldChampionships;
