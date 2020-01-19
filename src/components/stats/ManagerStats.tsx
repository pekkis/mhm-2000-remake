import React, { useState } from "react";
import { List, Map } from "immutable";

import Tabs from "../ui/Tabs";
import Tab from "../ui/Tab";
import Story from "./Story";

const TeamStats = props => {
  const { competitions, manager, stats, teams } = props;

  console.log("stats", stats.toJS());

  const [tab, setTab] = useState(0);

  const managersStories = stats
    .getIn(["seasons"])
    .map(season => season.getIn(["stories", manager.get("id")]));

  return (
    <div>
      <Tabs selected={tab} onSelect={setTab}>
        <Tab title="Kausi kaudelta">
          {managersStories
            .map((story, seasonIndex) => {
              return (
                <Story
                  key={seasonIndex}
                  season={seasonIndex}
                  story={story}
                  teams={teams}
                  competitions={competitions}
                />
              );
            })
            .reverse()}
        </Tab>
        <Tab title="Ura numeroina">
          <div>
            {List.of("phl", "division", "ehl")
              .map(c => competitions.get(c))
              .map(c => {
                const stat = stats.getIn(
                  ["managers", manager.get("id"), "games", c.get("id"), "0"],
                  Map({
                    win: 0,
                    draw: 0,
                    loss: 0
                  })
                );

                return (
                  <div key={c}>
                    <h3>{c.get("name")}</h3>

                    <table>
                      <tbody>
                        <tr>
                          <th>Otteluita</th>
                          <td>{stat.reduce((r, s) => r + s, 0)}</td>
                        </tr>
                        <tr>
                          <th>Voittoja</th>
                          <td>{stat.get("win")}</td>
                        </tr>
                        <tr>
                          <th>Tasapelejä</th>
                          <td>{stat.get("draw")}</td>
                        </tr>
                        <tr>
                          <th>Tappioita</th>
                          <td>{stat.get("loss")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default TeamStats;
