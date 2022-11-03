import { useAppSelector } from "../../hooks/useAppSelector";
import { CollapsableCompartment } from "../../layouts/CollapsableCompartment";
import { CompartmentDataAccordion } from "../../layouts/CompartmentDataAccordion";

export const CompartmentList = () => {
  const compartmentHash = useAppSelector(
    (state) => state.compartments.compartmentHash
  );

  {
    /* <CompartmentDataAccordion
            compartmentName={compartment.compartmentName}
            regions={compartment.regions}
          /> */
  }
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
