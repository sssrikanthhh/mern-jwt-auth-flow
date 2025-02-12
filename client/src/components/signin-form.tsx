import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type InputData = {
  email: string;
  password: string;
};

export function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<InputData>();

  const onSubmit: SubmitHandler<InputData> = data => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Enter a valid email address'
              }
            })}
          />
          {errors.email && (
            <p className='text-red-500'>{errors.email.message}</p>
          )}
        </div>
        <div className='grid gap-2'>
          <div className='flex items-center'>
            <Label htmlFor='password'>Password</Label>
            <Link
              to='/password/forgot'
              className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id='password'
            type='password'
            placeholder='use a password at least 8 characters'
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
          />
          {errors.password && (
            <p className='text-red-500'>{errors.password.message}</p>
          )}
        </div>
        <Button type='submit' className='w-full' disabled={isSubmitting}>
          Login
        </Button>
      </div>
      <div className='mt-4 text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link to='/signup' className='underline underline-offset-4'>
          Sign up
        </Link>
      </div>
    </form>
  );
}
