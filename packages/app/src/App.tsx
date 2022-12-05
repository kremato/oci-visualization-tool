import { useEffect } from "react";
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
import { ReduxCheckbox } from "./layouts/ReduxCheckbox";
import { LimitsDropdown } from "./components/Limits/LimitsDropdown";
import { Accordions } from "./layouts/Accordions";
import { inputActions } from "./store/inputSlice";

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
      <Grid container p={"1rem"}>
        <Grid container item>
          <Grid item xs={3}>
            <CompartmentsDropdown />
          </Grid>
          <Grid item xs={3}>
            <RegionsDropdown />
          </Grid>
          <Grid item xs={3}>
            <ServicesDropdown />
          </Grid>
          <Grid item xs={3}>
            <LimitsDropdown />
          </Grid>
          <Grid
            item
            xs={12}
            p={"0.5rem 0rem 0.5rem 0rem"}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <ReduxCheckbox
              label="Invalidate cache"
              action={inputActions.updateInvalidateCache}
              stateCallback={(state) => state.input.invalidateCache}
            />
            <ModifiableButton text={"Send"} action={sendData} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <hr />
        </Grid>
        <Grid item xs={12}>
          <div>
            <ReduxCheckbox
              label="Expand all"
              action={inputActions.upadateExpandAll}
              stateCallback={(state) => state.input.expandAll}
            />
          </div>
          <div>
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
          </div>
          <div>
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
              action={inputActions.updateNoQuota}
              stateCallback={(state) => state.input.hideNoQuota}
            />
          </div>
          <div>
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
          </div>
        </Grid>
        <Grid item xs={12}>
          <Accordions />
        </Grid>
      </Grid>
      ;
    </div>
  );
}

export default App;
