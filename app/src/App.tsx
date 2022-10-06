import { useEffect } from "react";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import { getCompartmentsList, getHierarchyMap } from "./store/compartmentsActionCreators";

function App() {
  const dispatch = useAppDispatch();
  const compartmets = useAppSelector((state) => state.compartments.compartmentsList)

  useEffect(() => {
    dispatch(getCompartmentsList());
    //dispatch(getHierarchyMap(compartmets));
  }, [dispatch, compartmets]);

  return <div>AHOJ</div>;
}

export default App;
