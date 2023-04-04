import { Grid, Stack } from "@mui/material";
import { LoadingBar } from "../components/Loading/LoadingBar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LimitsForm } from "../components/LimitsForm/LimitsForm";

export const DispatchLimitsRequestSubgrid = () => {
  useEffect(() => {}, []);

  return (
    <Grid container item xs={12}>
      <LimitsForm />
      <Stack direction={"row"} p={"0.5rem 0rem 0.5rem 0rem"} width={"100%"}>
        <LoadingBar />
      </Stack>
    </Grid>
  );
};
