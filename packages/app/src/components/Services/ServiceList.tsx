import { FormControlLabel, FormGroup } from "@mui/material";
import { useAppSelector } from "../../hooks/useAppSelector";
import { ModifiableCheckbox } from "../../layouts/ModifiableCheckbox";
import { SelectionList } from "../../layouts/SelectionLists";
import { ServiceSummary } from "../../types/types";

export const ServiceList = () => {
  const services = useAppSelector((state) => state.services.servicesList);

  return (
    <SelectionList subheader={"Services"}>
      <FormGroup>
        {services.map((item: ServiceSummary) => {
          if (!item.name) {
            return (
              // TODO: maybe add some key prop to the div?
              <div>{`Service with this description ${item.description} has undefined name`}</div>
            );
          }
          return (
            <FormControlLabel
              disabled
              control={<ModifiableCheckbox id={item.name} type={"service"} />}
              label={item.description}
              key={item.name}
            />
          );
        })}
      </FormGroup>
    </SelectionList>
  );
};
