import { deleteSession } from '@/lib/api';
import { Session } from '@/types/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteSession = (sessionId: string) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.setQueryData(['sessions'], (oldData: Session[]) =>
        oldData.filter(session => session._id !== sessionId)
      );
    }
  });

  return { deleteSession: mutate, ...rest };
};
