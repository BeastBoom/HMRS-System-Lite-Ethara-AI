import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-brand-100">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      {children}
    </div>
  );
};
