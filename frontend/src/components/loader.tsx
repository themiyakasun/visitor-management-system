import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Props {
  text?: string;
}

const Loader = ({ text = 'Loading...' }: Props) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm'
      )}
    >
      <Loader2 className='h-12 w-12 animate-spin text-primary' />
      <p className='mt-4 text-lg font-medium text-gray-700'>{text}</p>
    </div>
  );
};

export default Loader;
