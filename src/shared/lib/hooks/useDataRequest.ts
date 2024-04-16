import { useQuery } from 'react-query';
import { CACHE_TIME, STALE_TIME } from '../consts/time';

export const useDataRequest = <T>(
  queryKey: string,
  queryFn: () => Promise<T>,
) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery(
    queryKey,
    queryFn,
    {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
    },
  );
  return {
    data,
    isLoading,
    error,
  };
};
