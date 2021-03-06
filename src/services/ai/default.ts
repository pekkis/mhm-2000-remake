import { AIService } from "../../types/ai";
import { ComputerManager } from "../../types/manager";
import { SeasonStrategies } from "../../types/base";

const ai: AIService = {
  selectStrategy: function(manager: ComputerManager) {
    return "puurto" as SeasonStrategies;
  }
};

export default ai;
