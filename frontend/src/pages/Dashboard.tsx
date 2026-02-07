import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { dashboardApi } from '../services/api';
import type { DashboardSummary, TrendDataPoint, DepartmentDistributionItem } from '../types';
import { MetricCard } from '../components/ui/MetricCard';
import { ChartCard } from '../components/ui/ChartCard';
import { PageTransition } from '../components/ui/PageTransition';

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);
  const [distribution, setDistribution] = useState<DepartmentDistributionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState<'present' | 'absent' | 'combined'>('combined');

  const fetchData = useCallback(async () => {
      try {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
        const toDate = today.toISOString().split('T')[0];

        const [summaryData, trendsData, distributionData] = await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getTrends(fromDate, toDate),
          dashboardApi.getDistribution(),
        ]);

        setSummary(summaryData);
        setTrends(trendsData.series);
        setDistribution(distributionData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of employee attendance and metrics
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Employees"
            value={summary?.totalEmployees || 0}
            color="primary"
          />
          <MetricCard
            title="Present Today"
            value={summary?.todayPresent || 0}
            color="accent"
          />
          <MetricCard
            title="Present This Month"
            value={summary?.monthPresent || 0}
            color="sand"
          />
          <MetricCard
            title="Avg Attendance"
            value={`${summary?.avgAttendancePercent || 0}%`}
            color="primary"
            data={trends.map((t) => t.present)}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Attendance Trends (Last 30 Days)">
            <div className="flex justify-end space-x-2 mb-4">
               {(['present', 'absent', 'combined'] as const).map((mode) => (
                 <button
                   key={mode}
                   onClick={() => setChartMode(mode)}
                   className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                     chartMode === mode
                       ? 'bg-brand-500 text-white shadow-sm'
                       : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                   } capitalize`}
                 >
                   {mode}
                 </button>
               ))}
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F6B4E" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1FA07A" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7A2B1F" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF7A4D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(str) => {
                      const d = new Date(str);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                     stroke="#94A3B8"
                     fontSize={12}
                     tickLine={false}
                     axisLine={false}
                     dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  
                  {(chartMode === 'present' || chartMode === 'combined') && (
                    <Area
                      type="monotone"
                      dataKey="present"
                      stroke="#0F6B4E"
                      fillOpacity={1}
                      fill="url(#colorPresent)"
                      strokeWidth={2}
                      // Remove stackId to allow overlapping (proper line chart behavior)
                    />
                  )}
                  
                  {(chartMode === 'absent' || chartMode === 'combined') && (
                    <Area
                      type="monotone"
                      dataKey="absent"
                      stroke="#7A2B1F"
                      fillOpacity={1}
                      fill="url(#colorAbsent)"
                      strokeWidth={2}
                       // Remove stackId
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Department Distribution">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distribution}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0"/>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#475569" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                      width={100} 
                    />
                    <Tooltip 
                      cursor={{fill: '#F1F5F9'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                    />
                    <Bar dataKey="count" fill="#FFD8A8" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
          </ChartCard>
        </div>
      </div>
    </PageTransition>
  );
}
