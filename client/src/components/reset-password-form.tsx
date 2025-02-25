import { Label } from '@radix-ui/react-label';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spinner from './spinner';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@/lib/api';

type Input = {
  password: string;
};

export default function ResetPasswordForm({ code }: { code: string }) {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors }
  } = useForm<Input>();

  const {
    mutate: resetUserPassword,
    isError,
    isPending,
    isSuccess,
    error
  } = useMutation({
    mutationFn: resetPassword
  });

  const onSubmit = (data: Input) => {
    resetUserPassword({
      password: data.password,
      verificationCode: code
    });
  };

  return (
    <>
      {isSuccess ? (
        <>
          <Alert>
            <AlertTitle className='flex gap-1 items-center text-green-300'>
              <MailCheck />
              <span className='text-base'>Password Updated successfully</span>
            </AlertTitle>
            <AlertDescription>
              <Link
                to='/signin'
                className='text-base ml-2 underline-offset-2 underline font-bold'
              >
                Sign in to your account
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
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {isError && (
            <p className='text-red-500 text-center mb-1'>
              {error.message || 'An error occurred. Please try again.'}
            </p>
          )}
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>New Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='new password'
                {...register('password', {
                  required: 'Password is required'
                })}
              />
              {errors.password && (
                <p className='text-red-500'>{errors.password.message}</p>
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
        </form>
      )}
    </>
  );
}
