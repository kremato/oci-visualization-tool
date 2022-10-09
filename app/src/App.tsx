import { useEffect } from "react";
import Bar from "./components/Compartments/Bar";
import { CompartmentList } from "./components/Compartments/CompartmentList";
import { Foo } from "./components/Compartments/Foo";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";
import "./App.css";
import VirtualizedList from "./components/Compartments/VirtualizedList";

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
