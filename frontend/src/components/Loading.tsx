import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      {message && <p className="text-sm text-slate-500 font-medium">{message}</p>}
    </div>
  );
}
