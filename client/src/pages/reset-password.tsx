import ResetPasswordForm from '@/components/reset-password-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Link2Off } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const exp = Number(searchParams.get('exp'));
  const now = Date.now();
  const isLinkValid = code && exp && exp > now;

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>Enter a new password</CardTitle>
              <CardDescription>
                Note: Your password must be at least 8 characters long and only
                the owner of the account can reset the password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLinkValid ? (
                <ResetPasswordForm code={code} />
              ) : (
                <>
                  <Alert>
                    <AlertTitle className='flex gap-1 items-center text-red-300'>
                      <Link2Off />
                      <span className='text-base'>Invalid Link</span>
                    </AlertTitle>
                    <AlertDescription>
                      <Link
                        to='/password/forgot'
                        className='text-base ml-2 underline-offset-2 underline font-bold'
                      >
                        Request a new Link
                      </Link>
                    </AlertDescription>
                  </Alert>
                  <Button className='mt-3 ' variant='outline'>
                    <Link to='/' className='flex gap-2 items-center'>
                      <ArrowLeft />
                      Back to home
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
