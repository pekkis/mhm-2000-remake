import { nanoid } from "nanoid";

export const createUniqueId = (): string => {
  return nanoid(8);
};
