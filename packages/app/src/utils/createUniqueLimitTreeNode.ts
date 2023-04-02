import { UniqueLimit } from "common";
import { UniqueLimitTreeNode } from "../types/types";

export const createUniqueLimitTreeNode = (
  name: string,
  children: UniqueLimitTreeNode[] = [],
  limits?: UniqueLimit[]
): UniqueLimitTreeNode => {
  const node: UniqueLimitTreeNode = Object.create(null);
  node["name"] = name;
  node["children"] = children;
  if (limits) node["limits"] = limits;
  return node;
};
