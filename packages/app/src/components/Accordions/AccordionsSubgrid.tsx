import { useAppSelector } from "../../hooks/useAppSelector";
import { NestedAccordions } from "./NestedAccordions";
import { Stack, Grid } from "@mui/material";
import { DownloadButton } from "./DownloadButton";
import { AccordionHeader } from "./AccordionHeader";

export const AccordionsSubgrid = () => {
  const compartmentNodes = useAppSelector(
    (state) => state.nodes.compartmentNodes
  );
  const serviceNodes = useAppSelector((state) => state.nodes.serviceNodes);
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
    <Grid item xs={12} pt={2}>
      <Stack spacing={2}>
        {showByCompartment && (
          <div>
            <AccordionHeader title={"Limits Per Compartment"}>
              <DownloadButton
                buttonText="JSON"
                fileName={"limitsPerCompartment.json"}
                fileType={"text/json"}
                stateCallback={(state) => state.nodes.compartmentNodes}
              />
              <DownloadButton
                buttonText="CSV"
                fileName={"limitsPerCompartment.csv"}
                fileType={"text/csv"}
                stateCallback={(state) => state.nodes.compartmentNodes}
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
                fileName={"limitsPerService.json"}
                fileType={"text/json"}
                stateCallback={(state) => state.nodes.serviceNodes}
              />
              <DownloadButton
                buttonText="CSV"
                fileName={"limitsPerService.csv"}
                fileType={"text/csv"}
                stateCallback={(state) => state.nodes.serviceNodes}
                parseAsCSV={true}
                asCompartmentNodes={false}
              />
            </AccordionHeader>
            {Services}
          </div>
        )}
      </Stack>
    </Grid>
  );
};
