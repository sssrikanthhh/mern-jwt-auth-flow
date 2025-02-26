import { Routes, Route } from 'react-router-dom';
import Auth from '@/pages/auth';
import VerifyEmail from '@/pages/verify-email';
import ForgotPassword from '@/pages/forgot-password';
import ResetPassword from '@/pages/reset-password';
import AppContainer from '@/components/app-container';
import Profile from '@/components/profile';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<AppContainer />}>
        <Route index element={<Profile />} />
      </Route>
      <Route path='/signin' element={<Auth />} />
      <Route path='/signup' element={<Auth />} />
      <Route path='/email/verify/:code' element={<VerifyEmail />} />
      <Route path='/password/forgot' element={<ForgotPassword />} />
      <Route path='/password/reset' element={<ResetPassword />} />
    </Routes>
  );
}
