import { useEffect } from "react";
import { CompartmentList } from "./components/Compartments/CompartmentList";
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
      <CompartmentList />
      {/* <Foo id={"a"} depth={0} /> */}
    </>
  );
}

export default App;
