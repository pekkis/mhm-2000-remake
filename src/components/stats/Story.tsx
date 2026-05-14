import type { FC } from "react";
import Season from "@/components/data/Season";
import Achievements from "./Achievements";
import Box from "@/components/ui/Box";
import { Table, Td, Th } from "@/components/ui/Table";
import type { Team } from "@/state/game";
import type { Competition } from "@/types/competitions";
import type { SeasonStory } from "@/state/stats";

type StoryProps = {
  season: number;
  story: SeasonStory;
  teams: Team[];
  competitions: Record<string, Competition>;
};

const Story: FC<StoryProps> = ({ season, story, teams, competitions }) => {
  const t = story.mainCompetitionStat;
  return (
    <Box my="md">
      <h3>
        <Season long season={season} />{" "}
      </h3>

      <Table>
        <thead>
          <tr>
            <Th>Sarja</Th>
            <Th>Sija</Th>
            <Th>Joukkue</Th>
            <Th>O</Th>
            <Th>V</Th>
            <Th>TP</Th>
            <Th>H</Th>
            <Th>P</Th>
            <Th>ME</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>{competitions[story.mainCompetition].abbr}</Td>
            <Td>{story.ranking + 1}</Td>
            <Td>{teams[t.id]?.name}</Td>
            <Td>{t.gamesPlayed}</Td>
            <Td>{t.wins}</Td>
            <Td>{t.draws}</Td>
            <Td>{t.losses}</Td>
            <Td>{t.points}</Td>
            <Td>{t.goalsFor - t.goalsAgainst}</Td>
          </tr>
        </tbody>
      </Table>
      <Achievements story={story} />
    </Box>
  );
};

export default Story;
