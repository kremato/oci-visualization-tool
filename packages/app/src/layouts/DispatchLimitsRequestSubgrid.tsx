import { Grid } from "@mui/material";
import { CompartmentsDropdown } from "../components/Compartments/CompartmentsDropdown";
import { LimitsDropdown } from "../components/Limits/LimitsDropdown";
import LoadingBar from "../components/Loading/LoadingBar";
import { RegionsDropdown } from "../components/Regions/RegionsDropdown";
import { ServicesDropdown } from "../components/Services/ServicesDropdown";
import { inputActions } from "../store/inputSlice";
import { SendButton } from "./SendButton";
import { ReduxCheckbox } from "./ReduxCheckbox";

export const DispatchLimitsRequestSubgrid = () => {
  return (
    <Grid container item>
      <Grid item xs={3}>
        <CompartmentsDropdown />
      </Grid>
      <Grid item xs={3}>
        <RegionsDropdown />
      </Grid>
      <Grid item xs={3}>
        <ServicesDropdown />
      </Grid>
      <Grid item xs={3}>
        <LimitsDropdown />
      </Grid>
      <Grid
        item
        xs={12}
        p={"0.5rem 0rem 0.5rem 0rem"}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <ReduxCheckbox
          label="Invalidate cache"
          action={inputActions.updateInvalidateCache}
          stateCallback={(state) => state.input.invalidateCache}
        />
        <SendButton text={"Send"} />
      </Grid>
      <Grid
        item
        xs={12}
        p={"0.5rem 0rem 0.5rem 0rem"}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <LoadingBar />
      </Grid>
    </Grid>
  );
};
