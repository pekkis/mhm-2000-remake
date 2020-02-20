import React from "react";

import News from "./news/News";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Season from "./data/Season";
import Announcements from "./events/Announcements";
import { List } from "immutable";

import { Box } from "theme-ui";

const EndOfSeason = props => {
  const { manager, news, turn, announcements } = props;

  return (
    <HeaderedPage>
      <Header forward="Seuraava kausi" />

      <Box p={1}>
        <h2>
          Kausi <Season long index={turn.get("season")} />
        </h2>

        <Announcements
          announcements={announcements.get(
            manager.get("id").toString(),
            List()
          )}
        />

        <News manager={manager} news={news} />
      </Box>
    </HeaderedPage>
  );
};

export default EndOfSeason;
