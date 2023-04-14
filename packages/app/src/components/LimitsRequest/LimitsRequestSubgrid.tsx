import { Grid, Stack } from "@mui/material";
import { LoadingBar } from "./Loading/LoadingBar";
import { LimitsForm } from "./LimitsForm/LimitsForm";

export const LimitsRequestSubgrid = () => {
  return (
    <Grid container item xs={12}>
      <LimitsForm />
      <Stack direction={"row"} p={"0.5rem 0rem 0.5rem 0rem"} width={"100%"}>
        <LoadingBar />
      </Stack>
    </Grid>
  );
};
