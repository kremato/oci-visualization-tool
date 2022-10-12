import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useAppSelector } from "../../hooks/useAppSelector";
import { List, ListSubheader } from "@mui/material";
import { RegionSubscription } from "../../types/types";

export const Regions = () => {
  const regions = useAppSelector((state) => state.regions.regionsList);

  return (
    // TODO: make this list generic for both Regions component and CompartmentList component
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
      <FormGroup>
        {regions.map((item: RegionSubscription) => {
          return (
            <FormControlLabel
              disabled
              control={<Checkbox />}
              label={item.regionName}
              key={item.regionKey}
            />
          );
        })}
      </FormGroup>
    </List>
  );
};
