import { ApiStatus } from "../types/types";

export const getApiStatus = async (): Promise<ApiStatus> => {
  try {
    const request = new Request(`${import.meta.env.VITE_API}/`);
    const response = await fetch(request);
    if (response.status === 503) return "loading";
    if (!response.ok) return "down";
    return "up";
  } catch (e) {
    console.log(e);
    return "down";
  }
};
