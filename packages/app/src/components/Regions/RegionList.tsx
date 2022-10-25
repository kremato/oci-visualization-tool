import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useAppSelector } from "../../hooks/useAppSelector";
import { RegionSubscription } from "../../types/types";
import { SelectionList } from "../../layouts/SelectionLists";
import { ModifiableCheckbox } from "../../layouts/ModifiableCheckbox";

export const RegionList = () => {
  const regions = useAppSelector((state) => state.regions.regionsList);

  return (
    <SelectionList subheader={"Regions"}>
      <FormGroup>
        {regions.map((item: RegionSubscription) => {
          return (
            <FormControlLabel
              disabled
              control={
                <ModifiableCheckbox id={item.regionKey} type={"region"} />
              }
              label={item.regionName}
              key={item.regionKey}
            />
          );
        })}
      </FormGroup>
    </SelectionList>
  );
};
