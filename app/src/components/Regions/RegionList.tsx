import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useAppSelector } from "../../hooks/useAppSelector";
import { List, ListSubheader } from "@mui/material";
import { RegionSubscription } from "../../types/types";
import { SelectionList } from "../../layouts/SelectionLists";

export const RegionList = () => {
  const regions = useAppSelector((state) => state.regions.regionsList);

  return (
    <SelectionList subheader={"Regions"}>
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
    </SelectionList>
  );
};
