import useSWR from "swr";
import { ApiDropdownDataEndpoints } from "../types/types";
import fetcher from "../utils/fetcher";
import store from "../store/store";

export const useDropdownItemsData = <T>(
  apiEndpoint: ApiDropdownDataEndpoints
) => {
  const searchParams = new URLSearchParams({
    profile: store.getState().profile.profile || "",
  });
  let { data, error, isLoading } = useSWR<T[]>(
    `${import.meta.env.VITE_API}/${apiEndpoint}?` + searchParams,
    fetcher
  );

  if (!data || error || isLoading) data = [];

  return data;
};
