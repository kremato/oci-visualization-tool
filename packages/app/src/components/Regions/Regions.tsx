import { useAppSelector } from "../../hooks/useAppSelector";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "../../types/types";

export const Regions = () => {
  const regions = useAppSelector((state) => state.regions.regionsList);

  const options = regions.map((region) => {
    return { label: region.regionName, id: region.regionName };
  });
  return <Dropdown name={Names.Region} options={options} />;
};