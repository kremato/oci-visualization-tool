import { useAppSelector } from "../../hooks/useAppSelector";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "common";

export const ScopesDropdown = () => {
  const regions = useAppSelector((state) => state.regions.regionsList);

  const options = [
    { label: Names.AD, id: Names.AD },
    { label: Names.Region, id: Names.Region },
    { label: Names.Global, id: Names.Global },
  ];

  return <Dropdown name={Names.Scope} options={options} />;
};
