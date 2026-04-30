import { entries } from "remeda";
import Box from "./ui/Box";
import { useGameContext } from "@/context/game-machine-context";
import PhaseStatusPhase from "@/components/context-sensitive/PhaseStatusPhase";

const humanReadables: Record<string, string> = {
  loss: "tappiota",
  noWin: "voitotonta ottelua",
  noLoss: "tappiotonta ottelua",
  win: "voittoa"
};

type StreaksProps = {
  competition: string;
  team: number;
};

const Streaks = ({ competition, team }: StreaksProps) => {
  const streaks = useGameContext((ctx) => ctx.stats.streaks.team);

  const teamStreaks = streaks?.[team]?.[competition] ?? {};
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
