import type { FC } from "react";

type SeasonProps = {
  index: number;
  long?: boolean;
};

const Season: FC<SeasonProps> = ({ index, long = false }) => {
  if (!long) {
    return <>{index + 1998}</>;
  }

  return <>{`${index + 1997}-${index + 1998}`}</>;
};

export default Season;
