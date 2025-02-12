import { Routes, Route } from 'react-router-dom';
import Auth from '@/pages/auth';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<h1>Home</h1>} />
      <Route path='/signin' element={<Auth />} />
      <Route path='/signup' element={<Auth />} />
    </Routes>
  );
}
