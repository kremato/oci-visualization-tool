import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store/store";

console.log('[main.tsx] loaded')

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <div>{import.meta.env.VITE_PASSPHRASE}</div> */}
      <App />
    </Provider>
  </React.StrictMode>
);
