import type { FC } from "react";

type SeasonProps = {
  season: number;
  long?: boolean;
};

const Season: FC<SeasonProps> = ({ season, long = false }) => {
  if (!long) {
    return <>{season}</>;
  }

  return <>{`${season - 1}-${season}`}</>;
};

export default Season;
