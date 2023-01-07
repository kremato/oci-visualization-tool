import { Cache } from "../services/cache";

export const newRequest = (count: number) => {
  return Cache.getInstance().token.count != count + 1;
};
