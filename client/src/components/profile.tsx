import { useFetchUser } from '@/hooks/useFetchUser';
import { Card, CardContent, CardHeader } from './ui/card';
import { Alert, AlertTitle } from './ui/alert';
import { MailX } from 'lucide-react';
import { User } from '@/types/user';

export default function Profile() {
  const { user } = useFetchUser();
  const { email, verified, createdAt } = user as User;

  return (
    <div className=''>
      <Card className='max-w-sm mx-auto'>
        <CardHeader>
          <h1 className='text-2xl'>My Account</h1>
        </CardHeader>
        <CardContent>
          {!verified && (
            <Alert className='text-red-400 mb-2 border-red-400'>
              <AlertTitle className='flex items-center gap-2'>
                <MailX className='h-4 w-4 ' />
                <span>Please verify your email address</span>
              </AlertTitle>
            </Alert>
          )}
          <div className='flex items-center gap-3'>
            <h2 className='text-base font-medium'>Email: </h2>
            <p className='text-sm'>{email}</p>
          </div>
          <div className='flex items-center gap-3'>
            <h2 className='text-base font-medium'>Created on </h2>
            <p className='text-sm'>
              Email: {new Date(createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
