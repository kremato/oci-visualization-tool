import type { ResponseTree } from "common";

export const rotateScopes = (node: ResponseTree) => {
  if (node.children.length === 0) {
    return;
  }

  const childrenAreScope = node.children.reduce(
    (accumulator, child) =>
      accumulator || ["AD", "REGION"].includes(child.name),
    false
  );

  if (childrenAreScope && node.children[0]?.name === "REGION") {
    node.children = node.children.reverse();
    return;
  }

  for (const child of node.children) {
    rotateScopes(child);
  }
};
