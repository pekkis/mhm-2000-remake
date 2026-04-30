import { useState } from "react";
import type { FC } from "react";
import Tabs from "@/components/ui/Tabs";
import { Table, Td, Th } from "@/components/ui/Table";
import Season from "@/components/data/Season";

type TeamStatsProps = {
  stats: any;
  teams: any;
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
                  .map((season: any, seasonIndex: number) => (
                    <tr key={seasonIndex}>
                      <Td sticky="inline-start">
                        <Season index={seasonIndex} />
                      </Td>
                      {season.medalists?.map((m: string, k: number) => (
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
                  .map((season: any, seasonIndex: number) => (
                    <tr key={seasonIndex}>
                      <Td>
                        <Season index={seasonIndex} />
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
                  <Th>Nousija</Th>
                  <Th>Putoaja</Th>
                </tr>
              </thead>
              <tbody>
                {stats.seasons
                  .map((season: any, seasonIndex: number) => (
                    <tr key={seasonIndex}>
                      <Td>
                        <Season index={seasonIndex} />
                      </Td>
                      <Td>{teams[season.promoted]?.name ?? "-"}</Td>
                      <Td>{teams[season.relegated]?.name ?? "-"}</Td>
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
                  .map((season: any, seasonIndex: number) => (
                    <tr key={seasonIndex}>
                      <Td>
                        <Season index={seasonIndex} />
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
                  .map((season: any, seasonIndex: number) => (
                    <tr key={seasonIndex}>
                      <Td sticky="inline-start">
                        <Season index={seasonIndex} />
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
