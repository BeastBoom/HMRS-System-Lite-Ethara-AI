import { User, Mail, Calendar, Trash2, Edit2, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Employee } from '../../types';

interface EmployeeListProps {
  employees: Employee[];
  loading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export const EmployeeList = ({ 
  employees, 
  loading, 
  total = 0, 
  page = 1, 
  limit = 10, 
  onPageChange, 
  onSearch, 
  onEdit, 
  onDelete 
}: EmployeeListProps) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search employees..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">
           Loading employees...
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No employees found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold">
                    {employee.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{employee.fullName}</h3>
                    <p className="text-xs text-slate-500">{employee.department}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(employee)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                   <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">ID: {employee.employeeId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {onPageChange && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
