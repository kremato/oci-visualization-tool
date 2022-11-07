import { Names } from "common";
import { useAppSelector } from "../../hooks/useAppSelector";
import { CollapsableScope } from "../Scopes/CollapsableScope";
import { CollapsableCompartment } from "./CollapsableCompartment";

export const CompartmentAccordions = () => {
  const compartmentHash = useAppSelector(
    (state) => state.compartments.compartmentHash
  );

  return (
    <>
      {Object.entries(compartmentHash).map(([compartmentId, compartment]) => {
        return (
          <>
            {compartment.global && (
              <CollapsableScope
                scope={Names.Global}
                resourceObjectList={compartment.global}
              />
            )}
            <CollapsableCompartment
              compartmentName={compartment.compartmentName}
              regions={compartment.regions}
              key={compartmentId}
            />
          </>
        );
      })}
    </>
  );
};
