import { UniqueLimitTreeNode } from "../../types/types";
import { AccordionWrapper } from "./AccordionWrapper";
import { Table } from "../Table/Table";

interface Props {
  node: UniqueLimitTreeNode;
}

export const NestedAccordions = ({ node }: Props) => {
  return (
    <AccordionWrapper title={node.name}>
      {node.limits === undefined ? (
        node.children.map((childNode, index) => (
          <NestedAccordions node={childNode} key={index} />
        ))
      ) : (
        <Table uniqueLimits={node.limits} />
      )}
    </AccordionWrapper>
  );
};
