import { useMutation, useQueryClient } from 'react-query';

export const useMutationRequest = <T>(
  queryKey: string,
  queryFn: () => Promise<T>,
) => {
  const queryClient = useQueryClient();

  const {
    mutate,
    isLoading,
  } = useMutation(
    queryKey,
    queryFn,
    {
      onSuccess: (data) => {
        queryClient.setQueryData(queryKey, data);
      },
    },
  );
  return {
    mutate,
    isLoading,
  };
};
