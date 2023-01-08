import type { identity } from "oci-sdk";
import { regionsActions } from "./regionsSlice";
import { AppDispatch } from "./store";

export const fetchRegionsList = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const request = new Request(
        `${import.meta.env.VITE_API}/region-subscriptions`
      );
      const response = await fetch(request);
      const { data } = await response.json();
      dispatch(
        regionsActions.replaceRegions(
          data as identity.models.RegionSubscription[]
        )
      );
    } catch (e) {
      console.log(e);
    }
  };
};
