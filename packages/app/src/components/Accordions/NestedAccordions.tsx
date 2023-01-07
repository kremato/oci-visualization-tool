import { ResponseTreeNode } from "common";
import { AccordionWrapper } from "./AccordionWrapper";
import { Table } from "../../components/Tables/Table";

interface Props {
  node: ResponseTreeNode;
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
