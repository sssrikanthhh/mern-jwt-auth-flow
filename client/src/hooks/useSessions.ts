import { useQuery } from '@tanstack/react-query';
import { fetchSessions } from '@/lib/api';

export const useSessions = (opts = {}) => {
  const { data: sessions = [], ...rest } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
    ...opts
  });

  return { sessions, ...rest };
};
