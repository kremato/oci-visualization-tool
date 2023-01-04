import { useEffect } from "react";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchCompartmentsList } from "./store/compartmentsActionCreators";
import "./App.css";
import { fetchRegionsList } from "./store/regionsActionCreators";
import { fetchServicesList } from "./store/servicesActionCreator";
import { fetchLimitdefinitionsPerLimitName } from "./store/limitDefinitionsActionCreators";
import { Grid } from "@mui/material";
import { Accordions } from "./layouts/Accordions";
import { inputActions } from "./store/inputSlice";
import { DispatchRequestSubgrid } from "./layouts/DispatchRequestSubgrid";
import { TableOptionsSubgrid } from "./layouts/TableOptionsSubgrid";

interface tmp {
  failedServices: string[];
  countLoadedLimits: number;
  countLimitDefinitionSummaries: number;
}

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8546");
    ws.onopen = (_event) => console.log("Browser side WS connection opened!");
    ws.onmessage = (message) => {
      console.log(`Message from the server: ${message}`);
      console.dir(message);
      console.log("Message data");
      console.log(message.data);
      console.log("Message type");
      console.log(message.type);
      const data = JSON.parse(message.data) as tmp;
      console.log("Parsed data");
      console.log(data);
      dispatch(
        inputActions.updateProgressValue(
          Math.floor(
            (data.countLoadedLimits / data.countLimitDefinitionSummaries) * 100
          )
        )
      );
    };

    dispatch(fetchCompartmentsList());
    dispatch(fetchRegionsList());
    dispatch(fetchServicesList());
    dispatch(fetchLimitdefinitionsPerLimitName());
  }, [dispatch]);

  {
    /* <div className="App">
      <CompartmentList />
      <RegionList />
      <ServiceList />
      <ModifiableButton text={"Send"} action={sendData} />
    </div> */
  }

  return (
    <div className="App">
      <Grid container p={"1rem"}>
        <DispatchRequestSubgrid />
        <Grid item xs={12}>
          <hr />
        </Grid>
        <TableOptionsSubgrid />
        <Grid item xs={12}>
          <hr />
        </Grid>
        <Grid item xs={12}>
          <Accordions />
        </Grid>
      </Grid>
      ;
    </div>
  );
}

export default App;
