import { Grid, Stack } from "@mui/material";
import { checkboxConfigurationsActions } from "../../store/checkboxConfigurationsSlice";
import { ReduxCheckbox } from "./ReduxCheckbox";
import { Typography } from "@mui/material";

export const TableOptionsSubgrid = () => {
  return (
    <Grid container item pt={2} xs={12}>
      <Stack width={"100%"}>
        <Typography variant="h5">Accordion Display</Typography>
        <ReduxCheckbox
          label="Show limits per compartment"
          action={checkboxConfigurationsActions.updateShowByCompartment}
          stateCallback={(state) => state.input.showByCompartment}
        />
        <ReduxCheckbox
          label="Show limits per service"
          action={checkboxConfigurationsActions.updateShowByService}
          stateCallback={(state) => state.input.showByService}
        />
        <ReduxCheckbox
          label="Expand all"
          action={checkboxConfigurationsActions.updateExpandAll}
          stateCallback={(state) => state.input.expandAll}
        />
      </Stack>
      <Stack width={"100%"}>
        <Typography variant="h5">Table Configuration</Typography>
        <Stack direction={"row"} justifyContent={"flex-start"} width={"100%"}>
          <Stack flexGrow={1}>
            <ReduxCheckbox
              label="Hide limits with no service limit"
              action={checkboxConfigurationsActions.updateHideNoServiceLimit}
              stateCallback={(state) => state.input.hideNoServiceLimit}
            />
            <ReduxCheckbox
              label="Hide limits with no availability"
              action={checkboxConfigurationsActions.updateHideNoAvailability}
              stateCallback={(state) => state.input.hideNoAvailability}
            />
            <ReduxCheckbox
              label="Hide limits with no used"
              action={checkboxConfigurationsActions.updateHideNoUsed}
              stateCallback={(state) => state.input.hideNoUsed}
            />
            <ReduxCheckbox
              label="Hide limits with no quota"
              action={checkboxConfigurationsActions.updateHideNoQuota}
              stateCallback={(state) => state.input.hideNoQuota}
            />
          </Stack>
          <Stack flexGrow={4}>
            <ReduxCheckbox
              label="Sum AD resources"
              action={checkboxConfigurationsActions.updateSumADResources}
              stateCallback={(state) => state.input.sumADResources}
            />
            <ReduxCheckbox
              label="Show deprecated limits"
              action={checkboxConfigurationsActions.updateShowDeprecated}
              stateCallback={(state) => state.input.showDeprecated}
            />
          </Stack>
        </Stack>
      </Stack>
    </Grid>
  );
};
