import "./App.css";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";
import { fetchRegionsList } from "./store/regionsActionCreators";
import { fetchServicesList } from "./store/servicesActionCreator";
import { fetchLimitdefinitionsPerLimitName } from "./store/limitDefinitionsActionCreators";
import { Grid } from "@mui/material";
import { RootAccordions } from "./components/Accordions/RootAccordions";
import { DispatchLimitsRequestSubgrid } from "./layouts/DispatchLimitsRequestSubgrid";
import { TableOptionsSubgrid } from "./layouts/TableOptionsSubgrid";
import { Header } from "./components/Header/Header";

interface tmp {
  failedServices: string[];
  countLoadedLimits: number;
  countLimitDefinitionSummaries: number;
}

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCompartmentsList());
    dispatch(fetchRegionsList());
    dispatch(fetchServicesList());
    dispatch(fetchLimitdefinitionsPerLimitName());
  }, [dispatch]);

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
