import { useAppSelector } from "../hooks/useAppSelector";
import { Collapsable } from "./Collapsable";
import { Typography, Divider, Stack } from "@mui/material";

export const Accordions = () => {
  const compartmentNodes = useAppSelector(
    (state) => state.compartments.compartmentNodes
  );
  const serviceNodes = useAppSelector((state) => state.services.serviceNodes);
  const showByCompartment = useAppSelector(
    (state) => state.input.showByCompartment
  );
  const showByService = useAppSelector((state) => state.input.showByService);

  const Compartments = compartmentNodes.map((childNode, index) => {
    return <Collapsable node={childNode} key={index} />;
  });
  const Services = serviceNodes.map((childNode, index) => {
    return <Collapsable node={childNode} key={index} />;
  });

  return (
    <>
      <hr />
      <Stack spacing={2}>
        {showByCompartment && (
          <div>
            <Typography variant="h5">Limits Per Compartment</Typography>
            {Compartments}
          </div>
        )}
        {showByService && (
          <div>
            <Typography variant="h5">Limits Per Service</Typography>
            {Services}
          </div>
        )}
      </Stack>
    </>
  );
};
