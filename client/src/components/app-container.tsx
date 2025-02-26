import { useFetchUser } from '@/hooks/useFetchUser';
import Spinner from './spinner';
import { Navigate, Outlet } from 'react-router-dom';
import UserMenu from './user-menu';

export default function AppContainer() {
  const { user, isLoading } = useFetchUser();

  if (isLoading) {
    return (
      <div className='container max-auto w-screen h-screen flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to='/signin'
        replace
        state={{
          redirectUrl: window.location.pathname
        }}
      />
    );
  }

  return (
    <div className='container mx-auto w-screen h-screen py-6'>
      <UserMenu />
      <Outlet />
    </div>
  );
}
