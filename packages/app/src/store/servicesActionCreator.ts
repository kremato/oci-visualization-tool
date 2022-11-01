import { ServiceSummary } from "common";
import { servicesActions } from "./servicesSlice";
import { AppDispatch } from "./store";

// TODO: pridat navratove hodnoty funckcii alebo prerobit podla navodu
export const fetchServicesList = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const request = new Request(`${import.meta.env.VITE_API}/services`);

      const response = await fetch(request);
      const data = (await response.json()) as ServiceSummary[];
      dispatch(servicesActions.replaceServices(data));
    } catch (e) {
      console.log(e);
    }
  };
};
