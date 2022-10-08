import { useEffect } from "react";
import { Compartments } from "./components/Compartments/Compartments";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCompartmentsList());
  }, [dispatch]);

  return <Compartments />;
}

export default App;
