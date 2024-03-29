import store from "../store/store";
import { ApiStatus } from "../types/types";

export const fetchProfileStatus = async (): Promise<ApiStatus> => {
  try {
    const searchParams = new URLSearchParams({
      profile: store.getState().profile.profile || "",
    });
    const request = new Request(
      `${import.meta.env.VITE_API}/profiles/status?` + searchParams
    );
    const response = await fetch(request);
    if (response.status === 503) return "loading";
    if (!response.ok) {
      console.log(`Return code is not ok, code: ${response.status}. Message:`);
      console.log((await response.json())?.message);
      return "down";
    }
    return "ready";
  } catch (e) {
    console.log(e);
    return "down";
  }
};
