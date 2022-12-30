import type { ResponseTreeNode, UniqueLimit } from "common";

export const createResponseTreeNode = (
  name: string,
  children: ResponseTreeNode[] = [],
  limits?: UniqueLimit[]
): ResponseTreeNode => {
  const node: ResponseTreeNode = Object.create(null);
  node["name"] = name;
  node["children"] = children;
  if (limits) node["limits"] = limits;
  return node;
};
