import "./App.css";
import { Grid } from "@mui/material";
import { AccordionsSubgrid } from "./components/Accordions/AccordionsSubgrid";
import { LimitsRequestSubgrid } from "./components/LimitsRequest/LimitsRequestSubgrid";
import { TableOptionsSubgrid } from "./components/CheckboxConfigurationsSubgrid/TableOptionsSubgrid";
import { Header } from "./components/Header/Header";

export const App = () => {
  return (
    <div className="App">
      <Header />
      <Grid container p={"1rem"}>
        <LimitsRequestSubgrid />
        <Grid item xs={12}>
          <hr />
        </Grid>
        <TableOptionsSubgrid />
        <Grid item xs={12}>
          <hr />
        </Grid>
        <AccordionsSubgrid />
      </Grid>
    </div>
  );
};
