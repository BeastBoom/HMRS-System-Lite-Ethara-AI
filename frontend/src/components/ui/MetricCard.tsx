import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'accent' | 'sand' | 'brand';
  data?: number[];
}

export const MetricCard = ({ title, value, icon, trend, color = 'brand', data }: MetricCardProps) => {
  const colorStyles = {
    primary: 'bg-blue-50 text-blue-600',
    accent: 'bg-purple-50 text-purple-600',
    sand: 'bg-orange-50 text-orange-600',
    brand: 'bg-brand-50 text-brand-600',
  };

  const activeColor = colorStyles[color as keyof typeof colorStyles] || colorStyles.brand;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-brand-100 hover:-translate-y-1 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 pointer-events-none">
          {icon}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            {trend && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${activeColor}`}>
            {icon}
          </div>
        )}
      </div>
      {/* Simple sparkline placeholder if data makes sense */}
      {data && data.length > 0 && (
         <div className="mt-4 h-10 w-full bg-slate-50 rounded flex items-end overflow-hidden gap-0.5">
            {data.map((v, i) => (
                <div key={i} className="bg-brand-200 flex-1" style={{ height: `${Math.min(v * 2, 100)}%` }} />
            ))}
         </div>
      )}
    </div>
  );
};
