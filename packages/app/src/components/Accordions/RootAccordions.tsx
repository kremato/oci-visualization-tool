import { useAppSelector } from "../../hooks/useAppSelector";
import { NestedAccordions } from "./NestedAccordions";
import { Stack } from "@mui/material";
import { DownloadButton } from "./DownloadButton";
import { AccordionHeader } from "./AccordionHeader";

export const RootAccordions = () => {
  const compartmentNodes = useAppSelector(
    (state) => state.compartments.compartmentNodes
  );
  const serviceNodes = useAppSelector((state) => state.services.serviceNodes);
  const showByCompartment = useAppSelector(
    (state) => state.input.showByCompartment
  );
  const showByService = useAppSelector((state) => state.input.showByService);

  const Compartments = compartmentNodes.map((childNode, index) => {
    return <NestedAccordions node={childNode} key={index} />;
  });
  const Services = serviceNodes.map((childNode, index) => {
    return <NestedAccordions node={childNode} key={index} />;
  });

  return (
    <>
      <Stack spacing={2} pt={2}>
        {showByCompartment && (
          <div>
            <AccordionHeader title={"Limits Per Compartment"}>
              <DownloadButton
                buttonText="JSON"
                fileName={"limitsPerCompartment.json"}
                fileType={"text/json"}
                stateCallback={(state) => state.compartments.compartmentNodes}
              />
              <DownloadButton
                buttonText="CSV"
                fileName={"limitsPerCompartment.csv"}
                fileType={"text/csv"}
                stateCallback={(state) => state.compartments.compartmentNodes}
                parseAsCSV={true}
              />
            </AccordionHeader>
            {Compartments}
          </div>
        )}
        {showByService && (
          <div>
            <AccordionHeader title={"Limits Per Service"}>
              <DownloadButton
                buttonText="JSON"
                fileName={"limitsPerCompartment.json"}
                fileType={"text/json"}
                stateCallback={(state) => state.services.serviceNodes}
              />
              <DownloadButton
                buttonText="CSV"
                fileName={"limitsPerCompartment.csv"}
                fileType={"text/csv"}
                stateCallback={(state) => state.services.serviceNodes}
                parseAsCSV={true}
                asCompartmentNodes={false}
              />
            </AccordionHeader>
            {Services}
          </div>
        )}
      </Stack>
    </>
  );
};
