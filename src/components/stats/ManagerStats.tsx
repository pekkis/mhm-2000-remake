import { useState, type FC } from "react";
import Tabs from "@/components/ui/Tabs";
import { Table, Td, Th } from "@/components/ui/Table";
import Story from "./Story";
import type { Team } from "@/state/game";
import type { Manager } from "@/state/game";
import type { StatsState } from "@/state/stats";
import type { Competition } from "@/types/competitions";

type ManagerStatsProps = {
  competitions: Record<string, Competition>;
  manager: Manager;
  stats: StatsState;
  teams: Team[];
};

const ManagerStats: FC<ManagerStatsProps> = ({
  competitions,
  manager,
  stats,
  teams
}) => {
  const [tab, setTab] = useState(0);

  const managersStories = stats.seasons.map(
    (season) => season.stories?.[manager.id]
  );

  return (
    <Tabs
      selected={tab}
      onSelect={setTab}
      items={[
        {
          title: "Kausi kaudelta",
          content: () => (
            <>
              {managersStories
                .map((story, seasonIndex) => (
                  <Story
                    key={seasonIndex}
                    season={seasonIndex}
                    story={story}
                    teams={teams}
                    competitions={competitions}
                  />
                ))
                .toReversed()}
            </>
          )
        },
        {
          title: "Ura numeroina",
          content: () => (
            <div>
              {(["phl", "division", "ehl"] as const)
                .map((c) => competitions[c])
                .map((c) => {
                  const stat = stats.managers?.[manager.id]?.games?.[c.id]?.[
                    "0"
                  ] ?? {
                    win: 0,
                    draw: 0,
                    loss: 0
                  };

                  return (
                    <div key={c.id}>
                      <h3>{c.name}</h3>

                      <Table>
                        <tbody>
                          <tr>
                            <Th>Otteluita</Th>
                            <Td>{stat.win + stat.draw + stat.loss}</Td>
                          </tr>
                          <tr>
                            <Th>Voittoja</Th>
                            <Td>{stat.win}</Td>
                          </tr>
                          <tr>
                            <Th>Tasapelejä</Th>
                            <Td>{stat.draw}</Td>
                          </tr>
                          <tr>
                            <Th>Tappioita</Th>
                            <Td>{stat.loss}</Td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  );
                })}
            </div>
          )
        }
      ]}
    />
  );
};

export default ManagerStats;
