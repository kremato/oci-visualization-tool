import { useEffect } from "react";
import { CompartmentAccordions } from "./components/Compartments/CompartmentAcordions";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";
import "./App.css";
import { fetchRegionsList } from "./store/regionsActionCreators";
import { fetchServicesList } from "./store/servicesActionCreator";
import { fetchLimitsData } from "./store/inputActionCreators";
import { fetchLimitdefinitionsPerLimitName } from "./store/limitDefinitionsActionCreators";
import { ModifiableButton } from "./layouts/ModifiableButton";
import { Grid } from "@mui/material";
import { CompartmentsDropdown } from "./components/Compartments/CompartmentsDropdown";
import { RegionsDropdown } from "./components/Regions/RegionsDropdown";
import { ServicesDropdown } from "./components/Services/ServicesDropdown";
import { ScopesDropdown } from "./components/Scopes/ScopesDropdown";
import { ModifiableCheckbox } from "./layouts/ModifiableCheckbox";
import { LimitsDropdown } from "./components/Limits/LimitsDropdown";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCompartmentsList());
    dispatch(fetchRegionsList());
    dispatch(fetchServicesList());
    dispatch(fetchLimitdefinitionsPerLimitName());
  }, [dispatch]);

  const sendData = () => {
    console.log("Button clicked");
    dispatch(fetchLimitsData());
  };

  {
    /* <div className="App">
      <CompartmentList />
      <RegionList />
      <ServiceList />
      <ModifiableButton text={"Send"} action={sendData} />
    </div> */
  }

  return (
    <div className="App">
      <Grid container spacing={2} sx={{ p: "1rem" }}>
        <Grid item xs={3}>
          <CompartmentsDropdown />
        </Grid>
        <Grid item xs={3}>
          <RegionsDropdown />
        </Grid>
        <Grid item xs={1}>
          <ScopesDropdown />
        </Grid>
        <Grid item xs={2}>
          <ServicesDropdown />
        </Grid>
        <Grid item xs={3}>
          <LimitsDropdown />
        </Grid>
        <Grid item xs={1}>
          <ModifiableButton text={"Send"} action={sendData} />
          <ModifiableCheckbox />
        </Grid>
        <Grid item xs={12}>
          <CompartmentAccordions />
        </Grid>
      </Grid>
      ;
    </div>
  );
}

export default App;
