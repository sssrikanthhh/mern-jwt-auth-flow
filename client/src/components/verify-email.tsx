import { verifyEmail } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { MailX, MailCheck } from 'lucide-react';
import Spinner from './spinner';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

export default function VerifyEmail() {
  const { code } = useParams();

  const { isSuccess, isPending, isError } = useQuery({
    queryKey: ['verify-email', code],
    queryFn: () => verifyEmail(code!)
  });

  return (
    <section className='flex min-h-svh w-full justify-center p-6 md:p-10'>
      <div className='container mx-auto max-w-sm'>
        {isPending ? (
          <div className='w-full flex items-center justify-center'>
            <Spinner />
          </div>
        ) : (
          <Alert
            variant={isError ? 'destructive' : 'default'}
            className='w-full'
          >
            <AlertTitle className='flex gap-3 items-center'>
              {isSuccess ? (
                <MailCheck className='h-6 w-6' />
              ) : (
                <MailX className='h-6 w-6' />
              )}
              <span className='text-lg'>
                {isSuccess ? 'Email verified' : 'Invalid code'}
              </span>
            </AlertTitle>
            <AlertDescription>
              {isError && (
                <>
                  <p className='text-base'>
                    Your verification link has expired. Please request a new
                    one.
                  </p>
                  <Link to='#' className='text-base'>
                    Get a new Link
                  </Link>
                </>
              )}
              <div className='flex gap-3'>
                <Link to='/' className='text-base'>
                  Back to home
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </section>
  );
}
