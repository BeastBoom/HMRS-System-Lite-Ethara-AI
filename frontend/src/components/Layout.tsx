import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import AnimatedBackground from './ui/AnimatedBackground';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/employees', label: 'Employees' },
    { path: '/attendance', label: 'Attendance' },
    { path: '/update', label: 'Update' },
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2 group">
                   <img src="/vite.svg" alt="Logo" className="h-8 w-8 text-brand-700 group-hover:text-brand-900 transition-colors" />
                   <span className="text-xl font-bold text-brand-900 group-hover:text-brand-700 transition-colors">
                    HRMS
                   </span>
                </Link>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'text-brand-900 bg-brand-300/20'
                        : 'text-slate-700 hover:text-brand-900 hover:bg-brand-300/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="sm:hidden border-t">
          <div className="flex space-x-1 px-2 py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 text-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'text-brand-900 bg-brand-300/20'
                    : 'text-slate-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
