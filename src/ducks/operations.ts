import { indexBy, lensPath, over, mergeLeft, prop, curry } from "ramda";

export const addToMapFromList = curry(
  (lensPathArr: string[], list: any[], state: any) => {
    const map = indexBy(prop("id"), list);
    return over(lensPath(lensPathArr), mergeLeft(map), state);
  }
);
