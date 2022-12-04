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
import { ScopesDropdown } from "./components/Scopes/ScopesDropdown";
import { ModifiableCheckbox } from "./layouts/ModifiableCheckbox";
import { LimitsDropdown } from "./components/Limits/LimitsDropdown";
import { Accordions } from "./layouts/Accordions";
import { inputActions } from "./store/inputSlice";
import { useAppSelector } from "./hooks/useAppSelector";

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
        <Grid item xs={3}>
          <ServicesDropdown />
        </Grid>
        {/* <Grid item xs={2}>
          <ScopesDropdown />
        </Grid> */}
        <Grid item xs={3}>
          <LimitsDropdown />
        </Grid>
        <Grid item xs={12}>
          <ModifiableCheckbox
            label="Sum AD resources"
            action={inputActions.updateSumADResources}
          />
          <div>
            <ModifiableCheckbox
              label="Expand all"
              action={inputActions.upadateExpandAll}
            />
          </div>
          <div>
            <ModifiableCheckbox
              label="Hide limits with no availability"
              action={inputActions.updateHideNoAvailability}
              isChecked={true}
            />
            <ModifiableCheckbox
              label="Hide limits with no used"
              action={inputActions.updateHideNoUsed}
              isChecked={true}
            />
            <ModifiableCheckbox
              label="Hide limits with no quota"
              action={inputActions.updateNoQuota}
              isChecked={true}
            />
          </div>
          <div>
            <ModifiableCheckbox
              label="Show limits per compartment"
              action={inputActions.updateShowByCompartment}
            />
            <ModifiableCheckbox
              label="Show limits per service"
              action={inputActions.updateShowByService}
            />
          </div>
          <ModifiableButton text={"Send"} action={sendData} />
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
