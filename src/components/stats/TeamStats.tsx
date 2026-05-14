import { useState } from "react";
import type { FC } from "react";
import Tabs from "@/components/ui/Tabs";
import { Table, Td, Th } from "@/components/ui/Table";
import Season from "@/components/data/Season";
import type { StatsState } from "@/state/stats";
import type { Team } from "@/state/game";

type TeamStatsProps = {
  stats: StatsState;
  teams: Record<string, Team>;
  countries: Record<string, { name: string }>;
};

const TeamStats: FC<TeamStatsProps> = ({ stats, teams, countries }) => {
  const [tab, setTab] = useState(0);

  return (
    <Tabs
      selected={tab}
      onSelect={setTab}
      items={[
        {
          title: "Mitalistit",
          content: () => (
            <Table>
              <thead>
                <tr>
                  <Th sticky="inline-start">Vuosi</Th>
                  <Th>Kultaa</Th>
                  <Th>Hopeaa</Th>
                  <Th>Pronssia</Th>
                </tr>
              </thead>
              <tbody>
                {stats.seasons
                  .map((season) => (
                    <tr key={season.season}>
                      <Td sticky="inline-start">
                        <Season season={season.season} />
                      </Td>
                      {season.medalists?.map((m, k) => (
                        <Td key={k}>{teams[m]?.name}</Td>
                      ))}
                    </tr>
                  ))
                  .toReversed()}
              </tbody>
            </Table>
          )
        },
        {
          title: "Runkosarjan voittaja",
          content: () => (
            <Table>
              <thead>
                <tr>
                  <Th>Vuosi</Th>
                  <Th>Runkosarjan voittaja</Th>
                </tr>
              </thead>
              <tbody>
                {stats.seasons
                  .map((season) => (
                    <tr key={season.season}>
                      <Td>
                        <Season season={season.season} />
                      </Td>
                      <Td>{teams[season.presidentsTrophy]?.name}</Td>
                    </tr>
                  ))
                  .toReversed()}
              </tbody>
            </Table>
          )
        },
        {
          title: "Nousijat / putoajat",
          content: () => (
            <Table>
              <thead>
                <tr>
                  <Th>Vuosi</Th>
                  <Th>Div -- PHL</Th>
                  <Th>PHL -- div</Th>
                  <Th>Mut -- Div</Th>
                  <Th>Div -- Mut</Th>
                </tr>
              </thead>
              <tbody>
                {stats.seasons
                  .map((season) => (
                    <tr key={season.season}>
                      <Td>
                        <Season season={season.season} />
                      </Td>
                      <Td>
                        {" "}
                        {season.promoted.division.length > 0
                          ? season.promoted.division
                              .map((tid) => {
                                return teams[tid].name;
                              })
                              .join(", ")
                          : "-"}
                      </Td>
                      <Td>
                        {season.relegated.phl.length > 0
                          ? season.relegated.phl
                              .map((tid) => {
                                return teams[tid].name;
                              })
                              .join(", ")
                          : "-"}
                      </Td>

                      <Td>
                        {season.promoted.mutasarja.length > 0
                          ? season.promoted.mutasarja
                              .map((tid) => {
                                return teams[tid].name;
                              })
                              .join(", ")
                          : "-"}
                      </Td>
                      <Td>
                        {season.relegated.division.length > 0
                          ? season.relegated.division
                              .map((tid) => {
                                return teams[tid].name;
                              })
                              .join(", ")
                          : "-"}
                      </Td>
                    </tr>
                  ))
                  .toReversed()}
              </tbody>
            </Table>
          )
        },
        {
          title: "EHL",
          content: () => (
            <Table>
              <thead>
                <tr>
                  <Th>Vuosi</Th>
                  <Th>Euroopan mestari</Th>
                </tr>
              </thead>
              <tbody>
                {stats.seasons
                  .map((season) => (
                    <tr key={season.season}>
                      <Td>
                        <Season season={season.season} />
                      </Td>
                      <Td>{teams[season.ehlChampion]?.name}</Td>
                    </tr>
                  ))
                  .toReversed()}
              </tbody>
            </Table>
          )
        },
        {
          title: "MM-kisat",
          content: () => (
            <Table>
              <thead>
                <tr>
                  <Th sticky="inline-start">Vuosi</Th>
                  <Th>Kultaa</Th>
                  <Th>Hopeaa</Th>
                  <Th>Pronssia</Th>
                </tr>
              </thead>
              <tbody>
                {stats.seasons
                  .map((season) => (
                    <tr key={season.season}>
                      <Td sticky="inline-start">
                        <Season season={season.season} />
                      </Td>
                      {season.worldChampionships
                        ?.slice(0, 3)
                        .map((m: string, k: number) => (
                          <Td key={k}>{countries?.[m]?.name}</Td>
                        ))}
                    </tr>
                  ))
                  .toReversed()}
              </tbody>
            </Table>
          )
        }
      ]}
    />
  );
};

export default TeamStats;
