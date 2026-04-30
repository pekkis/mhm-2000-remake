import calendar from "@/data/calendar";
import { useGameContext } from "@/context/game-machine-context";

const Forward = () => {
  const turn = useGameContext((ctx) => ctx.turn);
  const competitions = useGameContext((ctx) => ctx.competitions);

  const calendarEntry = calendar[turn.round];

  const gamedays = calendarEntry.gamedays;

  if (gamedays.length > 0) {
    return (
      <div>
        Pelipäivä (
        {gamedays
          .map((gd) => competitions[gd])
          .map((c) => c.abbr)
          .join(", ")}
        )
      </div>
    );
  }

  if (calendarEntry.title) {
    return <div>{calendarEntry.title}</div>;
  }

  return <div>Eteenpäin!</div>;
};

export default Forward;
