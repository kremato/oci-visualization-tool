import { useAppSelector } from "../../hooks/useAppSelector";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { useState } from "react";
import { CollapsableWrapper } from "./CollapsableWrapper";
import { Compartment } from "./Compartment";
import { Box, Grid } from "@mui/material";

export const CompartmentList = () => {
  return (
    <Box sx={{ maxWidth: 752, maxHeight: 360 }}>
      <Grid item xs={12} md={6}>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Compartments
            </ListSubheader>
          }
          dense={true}
        >
          <Compartment id="rootId" depth={0} />
        </List>
      </Grid>
    </Box>
  );
};
