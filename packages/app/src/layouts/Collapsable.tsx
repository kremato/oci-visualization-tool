import { ResponseTree } from "common";
import { Typography } from "@mui/material";
import { AccordionWrapper } from "./AccordionWrapper";

interface Props {
  node: ResponseTree;
}

export const Collapsable = ({ node }: Props) => {
  return (
    <AccordionWrapper title={node.name}>
      {node.limits === undefined ? (
        node.children.map((childNode) => <Collapsable node={childNode} />)
      ) : (
        <Typography>TABLE GOES HERE</Typography>
      )}
    </AccordionWrapper>
  );
};
