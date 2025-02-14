import { useLocation } from 'react-router-dom';
import { SigninForm } from '@/components/signin-form';
import { SignupForm } from '@/components/signup-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';

export default function Auth() {
  const location = useLocation();
  const isSignin = location.pathname === '/signin';

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>
                {isSignin ? 'Signin' : 'Signup'}
              </CardTitle>
              <CardDescription>
                {isSignin
                  ? 'Enter your details below to signin into your account'
                  : 'Submit your details below to signup'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSignin ? <SigninForm /> : <SignupForm />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
