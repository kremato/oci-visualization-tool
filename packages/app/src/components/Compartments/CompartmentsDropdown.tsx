import { useAppSelector } from "../../hooks/useAppSelector";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "common";

export const CompartmentsDropdown = () => {
  const compartments = useAppSelector(
    (state) => state.compartments.compartmentList
  );

  const options = compartments.map((compartment) => {
    return { primaryLabel: compartment.name, secondaryLabel: compartment.id };
  });
  return <Dropdown name={Names.Compartment} options={options} />;
};
