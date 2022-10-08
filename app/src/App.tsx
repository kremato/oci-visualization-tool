import { useEffect } from "react";
import { Compartment } from "./components/Compartments/Compartment";
import { Foo } from "./components/Compartments/Foo";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCompartmentsList());
  }, [dispatch]);

  return (
    <>
      <Compartment id={"rootId"} depth={0} />
      {/* <Foo id={"a"} depth={0} /> */}
    </>
  );
}

export default App;
