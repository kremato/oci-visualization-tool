import { RegionSubscription } from "common";
import { regionsActions } from "./regionsSlice";
import { AppDispatch } from "./store";

// TODO: pridat navratove hodnoty funckcii alebo prerobit podla navodu
export const fetchRegionsList = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const request = new Request(`${import.meta.env.VITE_API}/regions`);

      const response = await fetch(request);
      const data = (await response.json()) as RegionSubscription[];
      dispatch(regionsActions.replaceRegions(data));
    } catch (e) {
      console.log(e);
    }
  };
};
