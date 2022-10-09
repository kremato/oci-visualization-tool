import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import { Compartment } from "./Compartment";

export const CompartmentList = () => {
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
          Compartments
        </ListSubheader>
      }
      dense={true}
    >
      <Compartment id="rootId" depth={0} />
    </List>
  );
};
