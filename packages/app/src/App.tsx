import { useEffect } from "react";
import { CompartmentAccordions } from "./components/Compartments/CompartmentAcordions";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";
import "./App.css";
import { fetchRegionsList } from "./store/regionsActionCreators";
import { fetchServicesList } from "./store/servicesActionCreator";
import { fetchLimitsData } from "./store/inputActionCreators";
import { ModifiableButton } from "./layouts/ModifiableButton";
import { Grid } from "@mui/material";
import { CompartmentsDropdown } from "./components/Compartments/CompartmentsDropdown";
import { RegionsDropdown } from "./components/Regions/RegionsDropdown";
import { Services } from "./components/Services/Services";
import { ScopesDropdown } from "./components/Scopes/ScopesDropdown";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCompartmentsList());
    dispatch(fetchRegionsList());
    dispatch(fetchServicesList());
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
        <Grid item xs={3}>
          <Services />
        </Grid>
        <Grid item xs={3}>
          <ScopesDropdown />
        </Grid>
        <Grid item xs={1}>
          <ModifiableButton text={"Send"} action={sendData} />
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
