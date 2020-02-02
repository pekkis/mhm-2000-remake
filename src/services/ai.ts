import defaultAi from "./ai/default";
import simonovAi from "./ai/juri-simonov";
import { MapOf } from "../types/base";
import { AIService } from "../types/ai";

const aiMap: MapOf<AIService> = {
  default: defaultAi,
  "juri-simonov": simonovAi
};

const getAi = (id = "default"): AIService => {
  if (!aiMap[id]) {
    throw new Error("Unknown AI");
  }

  return aiMap[id];
};

export default {
  getAi
};
