import { ComputerManager } from "./manager";
import { SeasonStrategies } from "./base";

type AIFunction<T> = Generator<any, T, any> | T;

export interface AIService {
  selectStrategy: {
    (manager: ComputerManager): AIFunction<SeasonStrategies>;
  };
}
