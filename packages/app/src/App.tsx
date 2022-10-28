import { useEffect } from "react";
import { CompartmentList } from "./components/Compartments/CompartmentList";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";
import "./App.css";
import { RegionList } from "./components/Regions/RegionList";
import { fetchRegionsList } from "./store/regionsActionCreators";
import { fetchServicesList } from "./store/servicesActionCreator";
import { ServiceList } from "./components/Services/ServiceList";
import { fetchLimitsData } from "./store/checkboxActionCreators";
import { ModifiableButton } from "./layouts/ModifiableButton";
import { Grid } from "@mui/material";
import { Compartments } from "./components/Compartments/Compartments";
import { Regions } from "./components/Regions/Regions";
import { Services } from "./components/Services/Services";

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

  {
    /* <Grid container spacing={2} sx={{ p: "1rem" }}>
    <Grid item xs={4}>
      <Compartments />
    </Grid>
    <Grid item xs={4}>
      <Regions />
    </Grid>
    <Grid item xs={3}>
      <Services />
    </Grid>
    <Grid item xs={1}>
      <ModifiableButton text={"Send"} action={sendData} />
    </Grid>
    <Grid item xs={6}>
      <div>xs=6</div>
    </Grid>
    <Grid item xs={6}>
      <div>xs=6</div>
    </Grid>
  </Grid>; */
  }
  return (
    <div className="App">
      <Grid container spacing={2} sx={{ p: "1rem" }}>
        <Grid item xs={4}>
          <Compartments />
        </Grid>
        <Grid item xs={4}>
          <Regions />
        </Grid>
        <Grid item xs={3}>
          <Services />
        </Grid>
        <Grid item xs={1}>
          <ModifiableButton text={"Send"} action={sendData} />
        </Grid>
        <Grid item xs={6}>
          <div>xs=6</div>
        </Grid>
        <Grid item xs={6}>
          <div>xs=6</div>
        </Grid>
      </Grid>
      ;
    </div>
  );
}

export default App;
