import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useAppSelector } from "../../hooks/useAppSelector";
import { SelectionList } from "../../layouts/SelectionLists";
import { ServiceSummary } from "../../types/types";

export const ServiceList = () => {
  const services = useAppSelector((state) => state.services.servicesList);

  return (
    <SelectionList subheader={"Services"}>
      <FormGroup>
        {services.map((item: ServiceSummary) => {
          return (
            <FormControlLabel
              disabled
              control={<Checkbox />}
              label={item.description}
              key={item.name}
            />
          );
        })}
      </FormGroup>
    </SelectionList>
  );
};
