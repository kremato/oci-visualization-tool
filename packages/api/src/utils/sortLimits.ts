import type { ResponseTreeNode, UniqueLimit } from "common";
import { limits } from "oci-sdk";

const compareLimits = (a: UniqueLimit, b: UniqueLimit) => {
  if (a.scope === b.scope) return a.limitName.localeCompare(b.limitName);
  return a.scope === limits.models.LimitDefinitionSummary.ScopeType.Ad ? -1 : 1;
};

export const sortLimits = (node: ResponseTreeNode) => {
  for (const child of node.children) {
    sortLimits(child);
  }

  if (node.limits) node.limits.sort(compareLimits);
};
