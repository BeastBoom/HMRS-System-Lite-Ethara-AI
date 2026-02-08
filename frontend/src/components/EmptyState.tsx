import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 group-hover:bg-brand-100 transition-colors mb-4">
        <Inbox className="h-8 w-8 text-brand-400 group-hover:text-brand-600 transition-colors" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-xs mx-auto">{description}</p>
    </div>
  );
}
