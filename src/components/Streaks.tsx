import { entries } from "remeda";
import Box from "./ui/Box";
import { useGameContext } from "@/context/game-machine-context";
import PhaseStatusPhase from "@/components/context-sensitive/PhaseStatusPhase";
import type { Streak } from "@/state";
import type { CompetitionId } from "@/types/competitions";

const humanReadables: Record<string, string> = {
  loss: "tappiota",
  noWin: "voitotonta ottelua",
  noLoss: "tappiotonta ottelua",
  win: "voittoa"
};

type StreaksProps = {
  competition: CompetitionId;
  team: number;
};

const Streaks = ({ competition, team }: StreaksProps) => {
  const streaks = useGameContext((ctx) => ctx.stats.streaks.team);

  const teamStreaks =
    streaks?.[team]?.[competition] ??
    ({
      win: 0,
      draw: 0,
      noWin: 0,
      loss: 0,
      noLoss: 0
    } satisfies Streak);
  const filtered = entries(teamStreaks).filter(([, s]) => s > 1);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <PhaseStatusPhase heading="Putket">
      <Box>
        {filtered.map(([key, s]) => {
          return (
            <Box key={key}>
              <strong>{s}</strong> {humanReadables[key]} putkeen.
            </Box>
          );
        })}
      </Box>
    </PhaseStatusPhase>
  );
};

export default Streaks;
