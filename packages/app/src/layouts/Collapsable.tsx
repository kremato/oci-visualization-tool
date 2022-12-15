import { ResponseTree } from "common";
import { Typography } from "@mui/material";
import { AccordionWrapper } from "./AccordionWrapper";
import { Table } from "../components/Tables/Table";

interface Props {
  node: ResponseTree;
}

export const Collapsable = ({ node }: Props) => {
  return (
    <AccordionWrapper title={node.name}>
      {/* {node.limits === undefined ? (
        node.children.map((childNode) => <Collapsable node={childNode} />)
      ) : (
        <Table uniqueLimits={node.limits} />
      )} */}
      {node.limits === undefined ? (
        node.children.map((childNode, index) => (
          <Collapsable node={childNode} key={index} />
        ))
      ) : (
        <Table uniqueLimits={node.limits} />
      )}
    </AccordionWrapper>
  );
};
