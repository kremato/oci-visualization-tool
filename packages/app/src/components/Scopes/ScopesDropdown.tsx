import { useAppSelector } from "../../hooks/useAppSelector";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "common";

export const ScopesDropdown = () => {
  const regions = useAppSelector((state) => state.regions.regionsList);

  const options = [
    { primaryLabel: Names.AD, secondaryLabel: Names.AD },
    { primaryLabel: Names.Region, secondaryLabel: Names.Region },
    { primaryLabel: Names.Global, secondaryLabel: Names.Global },
  ];

  return <Dropdown name={Names.Scope} options={options} />;
};
