import { useAppSelector } from "../../hooks/useAppSelector";
import { NestedAccordions } from "./NestedAccordions";
import { Typography, Stack } from "@mui/material";
import { DownloadButton } from "./DownloadButton";

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
            <Stack direction={"row"} justifyContent={"space-between"} pb={1}>
              <Typography variant="h5">Limits Per Compartment</Typography>
              <Stack spacing={2} direction={"row"}>
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
                />
              </Stack>
            </Stack>
            {Compartments}
          </div>
        )}
        {showByService && (
          <div>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography variant="h5">Limits Per Service</Typography>
              {/* <Stack spacing={2} direction={"row"}>
                <DownloadButton buttonText="JSON"
                  fileName={"text/json"}
                  fileType={"text/csv"} />
                <DownloadButton buttonText="CSV" />
              </Stack> */}
            </Stack>
            {Services}
          </div>
        )}
      </Stack>
    </>
  );
};
