import ehl from "../services/data/competitions/ehl";
import phl from "../services/data/competitions/phl";
import division from "../services/data/competitions/division";
import mutasarja from "../services/data/competitions/mutasarja";
import tournaments from "../services/data/competitions/tournaments";
import { ForEveryCompetition, CompetitionService } from "../types/base";

const competitions: ForEveryCompetition<CompetitionService> = {
  phl,
  division,
  mutasarja,
  ehl,
  tournaments
};

export default competitions;
