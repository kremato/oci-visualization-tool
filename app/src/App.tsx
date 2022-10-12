import { useEffect } from "react";
import { CompartmentList } from "./components/Compartments/CompartmentList";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";
import "./App.css";
import { Regions } from "./components/Regions/Region";
import { fetchRegionsList } from "./store/regionsActionCreators";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCompartmentsList());
    dispatch(fetchRegionsList());
  }, [dispatch]);

  return (
    <div className="App">
      <CompartmentList />
      <Regions />
    </div>
  );
}

export default App;
