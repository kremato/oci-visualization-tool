import { useEffect } from "react";
import { CompartmentList } from "./components/Compartments/CompartmentList";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";
import "./App.css";
import { RegionList } from "./components/Regions/RegionList";
import { fetchRegionsList } from "./store/regionsActionCreators";
import { fetchServicesList } from "./store/servicesActionCreator";
import { ServiceList } from "./components/Services/ServiceList";
import { createLimitsOverview, fillCheckboxes } from "./store/checkboxActionCreators";
import { ModifiableButton } from "./layouts/ModifiableButton";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const customEffect = async () => {
      Promise.all([
        dispatch(fetchCompartmentsList()),
        dispatch(fetchRegionsList()),
        dispatch(fetchServicesList()),
      ]).then(() => dispatch(fillCheckboxes()));
    };

    customEffect();
  }, [dispatch]);

  const sendData = () => {
    console.log('Button clicked')
    dispatch(createLimitsOverview())
  }

  return (
    <div className="App">
      <CompartmentList />
      <RegionList />
      <ServiceList />
      <ModifiableButton text={"Send"} action={sendData} />
    </div>
  );
}

export default App;
