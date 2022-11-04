import { useAppSelector } from "../../hooks/useAppSelector";
import { CollapsableCompartment } from "./CollapsableCompartment";

export const CompartmentAccordions = () => {
  const compartmentHash = useAppSelector(
    (state) => state.compartments.compartmentHash
  );

  return (
    <>
      {Object.values(compartmentHash).map((compartment) => {
        return (
          <CollapsableCompartment
            compartmentName={compartment.compartmentName}
            regions={compartment.regions}
          />
        );
      })}
    </>
  );
};
