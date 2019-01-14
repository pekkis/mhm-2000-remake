import React from "react";

import News from "./news/News";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";

import Box from "./styled-system/Box";

const EndOfSeason = props => {
  const { manager, news, turn } = props;

  return (
    <HeaderedPage>
      <Header forward="Seuraava kausi" />

      <Box p={1}>
        <h2>
          Kausi {turn.get("season")}-{turn.get("season") + 1}
        </h2>

        <News manager={manager} news={news} />
      </Box>
    </HeaderedPage>
  );
};

export default EndOfSeason;
