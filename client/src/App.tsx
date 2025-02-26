import { Routes, Route, useNavigate } from 'react-router-dom';
import Auth from '@/pages/auth';
import VerifyEmail from '@/pages/verify-email';
import ForgotPassword from '@/pages/forgot-password';
import ResetPassword from '@/pages/reset-password';
import AppContainer from '@/components/app-container';
import Profile from '@/components/profile';
import Settings from '@/components/settings';
import { setNavigate } from './lib/navigation';

export default function App() {
  const navigate = useNavigate();
  setNavigate(navigate);
  return (
    <Routes>
      <Route path='/' element={<AppContainer />}>
        <Route index element={<Profile />} />
        <Route path='/settings' element={<Settings />} />
      </Route>
      <Route path='/signin' element={<Auth />} />
      <Route path='/signup' element={<Auth />} />
      <Route path='/email/verify/:code' element={<VerifyEmail />} />
      <Route path='/password/forgot' element={<ForgotPassword />} />
      <Route path='/password/reset' element={<ResetPassword />} />
    </Routes>
  );
}
