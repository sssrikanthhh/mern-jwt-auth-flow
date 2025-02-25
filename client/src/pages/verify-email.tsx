import { verifyEmail } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { MailX, MailCheck, ArrowLeft } from 'lucide-react';
import Spinner from '@/components/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
          <div className='w-full flex items-center justify-center gap-3'>
            <Spinner />
            <span className='text-lg'>Verifying email...</span>
          </div>
        ) : (
          <>
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
                  {isSuccess ? 'Email verified successfully' : 'Invalid code'}
                </span>
              </AlertTitle>
              <AlertDescription>
                {isError && (
                  <p className='text-base'>
                    Your verification link has expired. Please request a new
                    one.
                    <Link
                      to='/password/reset'
                      className='text-base ml-2 underline-offset-2 underline font-bold'
                    >
                      Get a new Link
                    </Link>
                  </p>
                )}
              </AlertDescription>
            </Alert>
            <div className='flex gap-3'>
              <Link to='/' className='text-base text-center w-full mt-10'>
                <Button variant='outline'>
                  <ArrowLeft />
                  Back to home
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
