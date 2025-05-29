import { useQuery, UseQueryOptions } from 'react-query';

// Один день в миллисекундах:
export const ONE_DAY = 1000 * 60 * 60 * 24;

export const CACHE_TIME = ONE_DAY;
export const STALE_TIME = ONE_DAY;

export const useDataRequest = <T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options?: UseQueryOptions<T>,
) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<T>(
    queryKey,
    queryFn,
    {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      enabled: options?.enabled ?? true, // по умолчанию true
      ...options,
    },
  );

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
