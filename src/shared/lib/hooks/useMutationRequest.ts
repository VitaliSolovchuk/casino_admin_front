import { useMutation } from 'react-query';

export const useMutationRequest = <T>(
  queryKey: string,
  queryFn: () => Promise<T>,
) => {
  const {
    mutate,
  } = useMutation(
    queryKey,
    queryFn,
  );
  return {
    mutate,
  };
};
