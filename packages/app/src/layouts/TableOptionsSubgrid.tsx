import { Grid } from "@mui/material";
import { inputActions } from "../store/inputSlice";
import { ReduxCheckbox } from "./ReduxCheckbox";
import { Typography } from "@mui/material";

export const TableOptionsSubgrid = () => {
  return (
    <Grid container item xs={12} pt={2}>
      <Grid item xs={12} display={"flex"} flexDirection={"column"}>
        <Typography variant="h5">Accordion Display</Typography>
        <ReduxCheckbox
          label="Show limits per compartment"
          action={inputActions.updateShowByCompartment}
          stateCallback={(state) => state.input.showByCompartment}
        />
        <ReduxCheckbox
          label="Show limits per service"
          action={inputActions.updateShowByService}
          stateCallback={(state) => state.input.showByService}
        />
        <ReduxCheckbox
          label="Expand all"
          action={inputActions.updateExpandAll}
          stateCallback={(state) => state.input.expandAll}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">Table Configuration</Typography>
      </Grid>
      {/* <Grid item xs={4} display={"flex"} flexDirection={"column"}>
        <ReduxCheckbox
          label="Expand all"
          action={inputActions.updateExpandAll}
          stateCallback={(state) => state.input.expandAll}
        />
        <ReduxCheckbox
          label="Show limits per compartment"
          action={inputActions.updateShowByCompartment}
          stateCallback={(state) => state.input.showByCompartment}
        />
        <ReduxCheckbox
          label="Show limits per service"
          action={inputActions.updateShowByService}
          stateCallback={(state) => state.input.showByService}
        />
      </Grid> */}
      <Grid item xs={4} display={"flex"} flexDirection={"column"}>
        <ReduxCheckbox
          label="Hide limits with no service limit"
          action={inputActions.updateHideNoServiceLimits}
          stateCallback={(state) => state.input.hideNoServiceLimits}
        />
        <ReduxCheckbox
          label="Hide limits with no availability"
          action={inputActions.updateHideNoAvailability}
          stateCallback={(state) => state.input.hideNoAvailability}
        />
        <ReduxCheckbox
          label="Hide limits with no used"
          action={inputActions.updateHideNoUsed}
          stateCallback={(state) => state.input.hideNoUsed}
        />
        <ReduxCheckbox
          label="Hide limits with no quota"
          action={inputActions.updateHideNoQuota}
          stateCallback={(state) => state.input.hideNoQuota}
        />
      </Grid>
      <Grid item xs={4} display={"flex"} flexDirection={"column"}>
        <ReduxCheckbox
          label="Sum AD resources"
          action={inputActions.updateSumADResources}
          stateCallback={(state) => state.input.sumADResources}
        />
        <ReduxCheckbox
          label="Show deprecated limits"
          action={inputActions.updateShowDeprecated}
          stateCallback={(state) => state.input.showDeprecated}
        />
      </Grid>
    </Grid>
  );
};
