import { MyServiceSummary } from "common";
import { useDropdownItemsData } from "../../hooks/useDropdownItemsData";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "../../types/types";

export const ServicesDropdown = () => {
  const services = useDropdownItemsData<MyServiceSummary>("services");

  const options = services.map((service) => {
    return {
      primaryLabel: service.name,
      secondaryLabel: service.description,
    };
  });
  return <Dropdown name={Names.Service} options={options} />;
};
