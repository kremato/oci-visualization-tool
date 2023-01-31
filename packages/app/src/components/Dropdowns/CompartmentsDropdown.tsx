import { Dropdown } from "../../layouts/Dropdown";
import { Names } from "../../types/types";
import type { identity } from "oci-sdk";
import { useDropdownItemsData } from "../../hooks/useDropdownItemsData";

export const CompartmentsDropdown = () => {
  const compartments =
    useDropdownItemsData<identity.models.Compartment>("compartments");

  const options = compartments.map((compartment) => {
    return { primaryLabel: compartment.name, secondaryLabel: compartment.id };
  });
  return <Dropdown name={Names.Compartment} options={options} />;
};
