import type { FC } from "react";
import clsx from "clsx";
import * as styles from "./Name.css";
import type { Team } from "@/state/game";
import type { Manager } from "@/state/manager";
import { values } from "remeda";

type NameProps = {
  team: Team;
  managers?: Record<string, Manager>;
};

const Name: FC<NameProps> = ({ team, managers = {} }) => {
  const isHumanControlled = values(managers).some((p) => p.team === team.id);

  return (
    <span className={clsx(isHumanControlled && styles.humanControlled)}>
      {team.name}
    </span>
  );
};

export default Name;
