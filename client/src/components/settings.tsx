import { useSessions } from '@/hooks/useSessions';
import Spinner from './spinner';
import SessionCard from './session-card';

export default function Settings() {
  const { sessions, isPending, isSuccess, isError } = useSessions();
  return (
    <div className='container mx-auto py-6 flex justify-center'>
      <div>
        <h1 className='text-2xl'>My sessions</h1>
        {isPending && <Spinner />}
        {isError && <p className='text-red-500'>Failed to load sessions</p>}
        {isSuccess && (
          <div className='mt-4 flex flex-col gap-2'>
            {sessions.map(session => (
              <SessionCard key={session._id} {...session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
