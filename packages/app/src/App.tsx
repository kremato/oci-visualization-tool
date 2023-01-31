import "./App.css";
import { Grid } from "@mui/material";
import { RootAccordions } from "./components/Accordions/RootAccordions";
import { DispatchLimitsRequestSubgrid } from "./layouts/DispatchLimitsRequestSubgrid";
import { TableOptionsSubgrid } from "./layouts/TableOptionsSubgrid";
import { Header } from "./components/Header/Header";

export const App = () => {
  return (
    <div className="App">
      <Header />
      <Grid container p={"1rem"}>
        <DispatchLimitsRequestSubgrid />
        <Grid item xs={12}>
          <hr />
        </Grid>
        <TableOptionsSubgrid />
        <Grid item xs={12}>
          <hr />
        </Grid>
        <Grid item xs={12}>
          <RootAccordions />
        </Grid>
      </Grid>
      ;
    </div>
  );
};
