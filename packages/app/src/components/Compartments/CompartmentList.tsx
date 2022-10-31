import { useAppSelector } from "../../hooks/useAppSelector";
import { MyAccordion } from "../../layouts/MyAccordion";

export const CompartmentList = () => {
  const compartmentHash = useAppSelector(
    (state) => state.compartments.compartmentHash
  );

  return (
    <>
      {Object.values(compartmentHash).map((compartment) => {
        return <MyAccordion />;
      })}
    </>
  );
};
