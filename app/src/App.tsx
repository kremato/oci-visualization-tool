import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCompartmentsList } from "./store/compartmentsActionCreators";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCompartmentsList());
  }, [dispatch]);

  return <div>{``}</div>;
}

export default App;
