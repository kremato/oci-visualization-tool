import { UniqueLimit, limits } from "common";
import { UniqueLimitTreeNode } from "../types/types";

const compareLimits = (a: UniqueLimit, b: UniqueLimit) => {
  if (a.scope === b.scope) return a.limitName.localeCompare(b.limitName);
  return a.scope === "AD" ? -1 : 1;
};

export const sortLimits = (node: UniqueLimitTreeNode) => {
  for (const child of node.children) {
    sortLimits(child);
  }

  if (node.limits) node.limits.sort(compareLimits);
};
