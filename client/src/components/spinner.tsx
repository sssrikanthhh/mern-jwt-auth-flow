import { Loader } from 'lucide-react';

export default function Spinner() {
  return (
    <div>
      <Loader className='animate-spin h-6 w-6' />
    </div>
  );
}
