import { useDropdownItemsData } from "../../hooks/useDropdownItemsData";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "../../types/types";
import type { identity } from "common";

export const RegionsDropdown = () => {
  const regions = useDropdownItemsData<identity.models.RegionSubscription>(
    "region-subscriptions"
  );

  const options = regions.map((region) => {
    return {
      primaryLabel: region.regionName,

      secondaryLabel: region.regionName,
    };
  });
  return <Dropdown name={Names.Region} options={options} />;
};
