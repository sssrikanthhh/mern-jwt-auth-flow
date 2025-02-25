import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/lib/api';

export const useFetchUser = (opts = {}) => {
  const { data: user, ...rest } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: Infinity,
    ...opts
  });

  return { user, ...rest };
};
