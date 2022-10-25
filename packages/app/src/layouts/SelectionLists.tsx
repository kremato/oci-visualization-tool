import { List, ListSubheader } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  subheader: string;
  children?: ReactNode;
}

export const SelectionList = ({ subheader, children }: Props) => {
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        position: "relative",
        overflow: "auto",
        maxHeight: 300,
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {subheader}
        </ListSubheader>
      }
      dense={true}
    >
      {children}
    </List>
  );
};
