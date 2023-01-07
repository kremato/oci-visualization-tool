import { useAppSelector } from "../../hooks/useAppSelector";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "../../types/types";

export const ServicesDropdown = () => {
  const services = useAppSelector((state) => state.services.servicesList);

  const options = services.map((service) => {
    return {
      primaryLabel: service.name,
      secondaryLabel: service.description,
    };
  });
  return <Dropdown name={Names.Service} options={options} />;
};
