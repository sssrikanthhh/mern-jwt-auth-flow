import Spinner from '@/components/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { sendPasswordResetEmail } from '@/lib/api';
import { Label } from '@radix-ui/react-label';
import { useMutation } from '@tanstack/react-query';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

type Input = {
  email: string;
};

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<Input>();

  const {
    mutate: sendResetEmail,
    isError,
    isPending,
    isSuccess,
    error
  } = useMutation({
    mutationFn: sendPasswordResetEmail
  });

  const onSubmit = (data: Input) => {
    sendResetEmail(data.email);
  };

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>Reset your password</CardTitle>
              <CardDescription>
                Enter your email address and we will send you a password reset
                link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <>
                  <Alert>
                    <AlertTitle className='flex gap-1 items-center text-green-300'>
                      <MailCheck />
                      <span className='text-base'>
                        Password reset email sent successfully
                      </span>
                    </AlertTitle>
                    <AlertDescription>
                      <p className='text-base'>
                        Please check your email for the password reset link.
                      </p>
                    </AlertDescription>
                  </Alert>
                  <Button className='mt-3 ' variant='outline'>
                    <Link to='/' className='flex gap-2 items-center'>
                      <ArrowLeft />
                      Back to home
                    </Link>
                  </Button>
                </>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {isError && (
                    <p className='text-red-500 text-center mb-1'>
                      {error.message || 'An error occurred. Please try again.'}
                    </p>
                  )}
                  <div className='flex flex-col gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='use a valid email'
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Enter a valid email address'
                          }
                        })}
                      />
                      {errors.email && (
                        <p className='text-red-500'>{errors.email.message}</p>
                      )}
                    </div>
                    <Button
                      type='submit'
                      className='w-full'
                      disabled={isSubmitting || isPending}
                    >
                      {isPending ? (
                        <>
                          <Spinner />
                          Sending...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </div>
                  <div className='mt-4 text-sm flex gap-2 justify-center'>
                    Go back to
                    <Link
                      to='/signup'
                      className='underline underline-offset-2 font-medium'
                    >
                      Sign in
                    </Link>
                    <span>|</span>
                    <Link
                      to='/signin'
                      className='underline underline-offset-2 font-medium'
                    >
                      Sign up
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
