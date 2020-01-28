import ehl from "./data/competitions/ehl";
import phl from "./data/competitions/phl";
import division from "./data/competitions/division";
import mutasarja from "./data/competitions/mutasarja";
import tournaments from "./data/competitions/tournaments";
import cup from "./data/competitions/cup";
import training from "./data/competitions/training";
import {
  ForEveryCompetition,
  CompetitionService,
  CompetitionGroup
} from "../types/base";

const competitions: ForEveryCompetition<CompetitionService> = {
  phl,
  division,
  mutasarja,
  ehl,
  tournaments,
  cup,
  training
};

export default competitions;

export const isCompetitionGroupOver = (group: CompetitionGroup) => {
  console.log(group.name, group.round, group.schedule.length);
  return group.round === group.schedule.length;
};
