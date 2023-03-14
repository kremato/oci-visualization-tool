import { Dropdown } from "../../../layouts/Dropdown";
import type { identity } from "common";
import { useDropdownItemsData } from "../../../hooks/useDropdownItemsData";
import { Control } from "react-hook-form";
import { LimitsFormEntries, LimitsFormValues } from "../../../types/types";

interface Props {
  control: Control<LimitsFormValues, any>;
}

export const CompartmentsDropdown = ({ control }: Props) => {
  const compartments =
    useDropdownItemsData<identity.models.Compartment>("compartments");

  const options = compartments.map((compartment) => {
    return { primaryLabel: compartment.name, secondaryLabel: compartment.id };
  });
  return (
    <Dropdown
      name={LimitsFormEntries.Compartments}
      options={options}
      control={control}
    />
  );
};
