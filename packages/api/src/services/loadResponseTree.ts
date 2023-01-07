import type { ResponseTreeNode, UniqueLimit } from "common";
import path from "path";
import { log } from "../utils/log";

const filePath = path.basename(__filename);

const addNode = (
  limitPath: string[],
  uniqueLimit: UniqueLimit,
  node: ResponseTreeNode
) => {
  if (limitPath.length === 0) {
    if (node.children.length !== 0)
      log(filePath, `pushing UniqueLimits into node.limits in a non leaf!`);

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

  const child: ResponseTreeNode = Object.create(null);
  child["name"] = currentStop;
  child.children = [];
  node.children.push(child);

  addNode(limitPath, uniqueLimit, child);
};

export const loadResponseTree = (
  uniqueLimit: UniqueLimit,
  root: ResponseTreeNode,
  type: "compartment" | "service"
) => {
  // in case of global, remove '!'
  let limitPath =
    type === "compartment"
      ? [
          uniqueLimit.serviceName,
          uniqueLimit.scope,
          uniqueLimit.regionId,
          uniqueLimit.compartmentName,
        ]
      : [
          uniqueLimit.scope,
          uniqueLimit.regionId,
          uniqueLimit.compartmentName,
          uniqueLimit.serviceName,
        ];

  addNode(limitPath, uniqueLimit, root);
};
