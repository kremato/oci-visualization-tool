import { useAppSelector } from "../../hooks/useAppSelector";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "../../types/types";

export const CompartmentsDropdown = () => {
  const compartments = useAppSelector(
    (state) => state.compartments.compartmentList
  );

  const options = compartments.map((compartment) => {
    return { label: compartment.name, id: compartment.id };
  });
  return <Dropdown name={Names.Compartment} options={options} />;
};
