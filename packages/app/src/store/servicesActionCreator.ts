import { ServiceSummary } from "common";
import { servicesActions } from "./servicesSlice";
import { AppDispatch } from "./store";

export const fetchServicesList = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const request = new Request(`${import.meta.env.VITE_API}/services`);
      const response = await fetch(request);
      const { data } = await response.json();
      dispatch(servicesActions.replaceServices(data as ServiceSummary[]));
    } catch (e) {
      console.log(e);
    }
  };
};
