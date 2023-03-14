import { useDropdownItemsData } from "../../../hooks/useDropdownItemsData";
import { Dropdown } from "../../../layouts/Dropdown";
import type { identity } from "common";
import { Control } from "react-hook-form";
import { LimitsFormEntries, LimitsFormValues } from "../../../types/types";

interface Props {
  control: Control<LimitsFormValues, any>;
}

export const RegionsDropdown = ({ control }: Props) => {
  const regions = useDropdownItemsData<identity.models.RegionSubscription>(
    "region-subscriptions"
  );

  const options = regions.map((region) => {
    return {
      primaryLabel: region.regionName,
      secondaryLabel: region.regionName,
    };
  });
  return (
    <Dropdown
      name={LimitsFormEntries.Regions}
      options={options}
      control={control}
    />
  );
};
