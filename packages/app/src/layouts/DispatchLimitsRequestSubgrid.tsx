import { Grid, Stack } from "@mui/material";
import { CompartmentsDropdown } from "../components/Dropdowns/CompartmentsDropdown";
import { LimitsDropdown } from "../components/Dropdowns/LimitsDropdown";
import { LoadingBar } from "../components/Loading/LoadingBar";
import { RegionsDropdown } from "../components/Dropdowns/RegionsDropdown";
import { ServicesDropdown } from "../components/Dropdowns/ServicesDropdown";
import { inputActions } from "../store/inputSlice";
import { SendButton } from "./SendButton";
import { ReduxCheckbox } from "./ReduxCheckbox";

export const DispatchLimitsRequestSubgrid = () => {
  return (
    <Grid container item xs={12}>
      <Stack direction={"row"} width={"100%"}>
        <CompartmentsDropdown />
        <RegionsDropdown />
        <ServicesDropdown />
        <LimitsDropdown />
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        p={"0.5rem 0rem 0.5rem 0rem"}
        width={"100%"}
      >
        <ReduxCheckbox
          label="Invalidate cache"
          action={inputActions.updateInvalidateCache}
          stateCallback={(state) => state.input.invalidateCache}
        />
        <SendButton text={"Send"} />
      </Stack>
      <Stack direction={"row"} p={"0.5rem 0rem 0.5rem 0rem"} width={"100%"}>
        <LoadingBar />
      </Stack>
    </Grid>
  );
};
