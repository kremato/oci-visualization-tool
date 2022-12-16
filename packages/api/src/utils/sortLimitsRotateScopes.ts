import type { ResponseTree } from "common";

export const sortLimitsRotateScopes = (node: ResponseTree) => {
  for (const child of node.children) {
    sortLimitsRotateScopes(child);
  }

  if (node.limits)
    node.limits.sort((a, b) => a.limitName.localeCompare(b.limitName));

  const childrenAreScope = node.children.reduce(
    (accumulator, child) =>
      accumulator && ["AD", "REGION"].includes(child.name),
    true
  );

  if (childrenAreScope && node.children[0]?.name === "REGION") {
    node.children = node.children.reverse();
    return;
  }
};
