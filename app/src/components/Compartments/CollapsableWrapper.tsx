import { FC, ReactNode, useState } from "react";
import Collapse from "@mui/material/Collapse";
import { List } from "@mui/material";

interface Props {
  condition: boolean;
  open: boolean;
  children?: ReactNode;
}

export const CollapsableWrapper = ({ condition, open, children }: Props) => {
  return condition ? (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List
        sx={{ width: "100%", maxHeight: "10%" }}
        component="div"
        disablePadding
        dense={true}
      >
        {children}
      </List>
    </Collapse>
  ) : (
    <>{children}</>
  );
};
