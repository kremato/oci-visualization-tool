import { useAppSelector } from "../../hooks/useAppSelector";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "common";

export const Services = () => {
  const services = useAppSelector((state) => state.services.servicesList);

  const options = services.map((service) => {
    // It is ok to use ! operator, since services with no name
    // are filtered out in replaceServices reducer
    return { label: service.name!, id: service.name! };
  });
  return <Dropdown name={Names.Service} options={options} />;
};
