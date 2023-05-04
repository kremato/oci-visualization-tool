import { MyServiceSummary } from "common";
import { useDropdownItemsData } from "../../../../hooks/useDropdownItemsData";
import { Dropdown } from "./Dropdown";
import { Control } from "react-hook-form";
import { LimitsFormEntries, LimitsFormValues } from "../../../../types/types";

interface Props {
  control: Control<LimitsFormValues, any>;
}

export const ServicesDropdown = ({ control }: Props) => {
  const services = useDropdownItemsData<MyServiceSummary>("services");

  const options = services.map((service) => {
    return {
      primaryLabel: service.name,
      secondaryLabel: service.description,
    };
  });
  return (
    <Dropdown
      name={LimitsFormEntries.Services}
      options={options}
      control={control}
    />
  );
};
