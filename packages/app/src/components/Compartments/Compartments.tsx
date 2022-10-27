import { useAppSelector } from "../../hooks/useAppSelector";
import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "../../types/types";

export const Compartments = () => {
  const compartments = useAppSelector(
    (state) => state.compartments.compartmentsList
  );

  const options = compartments.map((compartment) => {
    return { label: compartment.name, id: compartment.id };
  });
  return <Dropdown name={Names.Compartment} options={options} />;
};
