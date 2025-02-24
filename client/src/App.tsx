import { Routes, Route } from 'react-router-dom';
import Auth from '@/pages/auth';
import VerifyEmail from './components/verify-email';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<h1>Home</h1>} />
      <Route path='/signin' element={<Auth />} />
      <Route path='/signup' element={<Auth />} />
      <Route path='/email/verify/:code' element={<VerifyEmail />} />
    </Routes>
  );
}
