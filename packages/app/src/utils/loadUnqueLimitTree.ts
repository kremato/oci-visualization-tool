import type { UniqueLimit } from "common";
import { UniqueLimitTreeNode } from "../types/types";

const addNode = (
  limitPath: string[],
  uniqueLimit: UniqueLimit,
  node: UniqueLimitTreeNode
) => {
  if (limitPath.length === 0) {
    if (node.children.length !== 0)
      console.log(`pushing UniqueLimits into node.limits in a non leaf!`);

    if (!node.limits) {
      node["limits"] = [uniqueLimit];
    } else {
      node.limits.push(uniqueLimit);
    }
    return;
  }

  const currentStop = limitPath.pop()!;

  for (const child of node.children) {
    if (child.name === currentStop) {
      addNode(limitPath, uniqueLimit, child);
      return;
    }
  }

  const child: UniqueLimitTreeNode = Object.create(null);
  child["name"] = currentStop;
  child.children = [];
  node.children.push(child);

  addNode(limitPath, uniqueLimit, child);
};

export const loadUniqueLimitTree = (
  uniqueLimit: UniqueLimit,
  root: UniqueLimitTreeNode,
  type: "compartment" | "service"
) => {
  let limitPath =
    type === "compartment"
      ? [
          uniqueLimit.serviceName,
          uniqueLimit.regionId,
          uniqueLimit.compartmentName,
        ]
      : [
          uniqueLimit.regionId,
          uniqueLimit.compartmentName,
          uniqueLimit.serviceName,
        ];

  addNode(limitPath, uniqueLimit, root);
};
