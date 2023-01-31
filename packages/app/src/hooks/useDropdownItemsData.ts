import useSWR from "swr";
import { ApiDropdownDataEndpoints } from "../types/types";
import fetcher from "../utils/fetcher";

export const useDropdownItemsData = <T>(
  apiEndpoint: ApiDropdownDataEndpoints
) => {
  let { data, error, isLoading } = useSWR<T[]>(
    `${import.meta.env.VITE_API}/${apiEndpoint}`,
    fetcher
  );

  if (!data || error || isLoading) data = [];

  return data;
};
