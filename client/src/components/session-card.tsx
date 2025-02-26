import { MonitorDot, Trash2 } from 'lucide-react';
import { Session } from '@/types/session';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useDeleteSession } from '@/hooks/useDeleteSession';
import Spinner from './spinner';

export default function SessionCard(session: Session) {
  const { _id, userAgent, createdAt, isCurrent } = session;
  const { deleteSession, isPending } = useDeleteSession(_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          {new Date(createdAt).toLocaleString('en-US')}
          {isCurrent && (
            <span className='text-green-400 flex gap-1 items-center'>
              <MonitorDot className='h-4 w-4' />
              <span className='text-base'>Current session</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>{userAgent}</p>
        {!isCurrent && (
          <Button
            variant='destructive'
            className='cursor-pointer'
            title='Delete session'
            onClick={() => deleteSession()}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner />
                Revoking...
              </>
            ) : (
              <>
                <Trash2 />
                Revoke
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
