import ehl from "./competitions/ehl";
import phl from "./competitions/phl";
import division from "./competitions/division";
import mutasarja from "./competitions/mutasarja";
import tournaments from "./competitions/tournaments";
import { ForEveryCompetition, CompetitionService } from "../types/base";

const competitions: ForEveryCompetition<CompetitionService> = {
  phl,
  division,
  mutasarja,
  ehl,
  tournaments
};

export default competitions;
