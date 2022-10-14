import { useEffect } from "react";
import { CompartmentList } from "./components/Compartments/CompartmentList";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";
import "./App.css";
import { RegionList } from "./components/Regions/RegionList";
import { fetchRegionsList } from "./store/regionsActionCreators";
import { fetchServicesList } from "./store/servicesActionCreator";
import { ServiceList } from "./components/Services/ServiceList";
import { fillCheckboxes } from "./store/checkboxActionCreators";

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

  return (
    <div className="App">
      <CompartmentList />
      <RegionList />
      <ServiceList />
    </div>
  );
}

export default App;
