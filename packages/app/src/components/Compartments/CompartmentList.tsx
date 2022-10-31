import { useAppSelector } from "../../hooks/useAppSelector";
import { CompartmentDataAccordion } from "../../layouts/CompartmentDataAccordion";

export const CompartmentList = () => {
  const compartmentHash = useAppSelector(
    (state) => state.compartments.compartmentHash
  );

  return (
    <>
      {Object.values(compartmentHash).map((compartment) => {
        return (
          <CompartmentDataAccordion
            compartmentName={compartment.compartmentName}
            regions={compartment.regions}
          />
        );
      })}
    </>
  );
};
