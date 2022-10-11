import { useEffect } from "react";
import { CompartmentList } from "./components/Compartments/CompartmentList";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCompartmentsList());
  }, [dispatch]);

  return (
    <div className="App">
      {/* <VirtualizedList /> */}
      {/* <Bar /> */}
      <CompartmentList />
      {/* <Foo id={"a"} depth={0} /> */}
    </div>
  );
}

export default App;
