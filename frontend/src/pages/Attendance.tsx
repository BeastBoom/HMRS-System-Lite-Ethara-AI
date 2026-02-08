import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Check, Search, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { employeeApi, attendanceApi } from '../services/api';
import type { Employee } from '../types';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorDisplay from '../components/ErrorDisplay';
import { PageTransition } from '../components/ui/PageTransition';

export default function Attendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mode selection
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  // Single Mode State
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  // Use local date for default value to avoid timezone issues
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState<'present' | 'absent'>('present');
  const [submitting, setSubmitting] = useState(false);

  // Bulk Mode State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkSearch, setBulkSearch] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeApi.getAll();
      setEmployees(data.employees);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filtered employees for bulk mode
  const filteredEmployees = useMemo(() => {
    if (!bulkSearch) return employees;
    const lower = bulkSearch.toLowerCase();
    return employees.filter(e => 
      e.fullName.toLowerCase().includes(lower) || 
      e.employeeId.toLowerCase().includes(lower) ||
      e.department.toLowerCase().includes(lower)
    );
  }, [employees, bulkSearch]);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    const employee = employees.find((e) => e.id === selectedEmployee);
    if (!employee) return;

    try {
      setSubmitting(true);
      await attendanceApi.mark({
        employeeId: employee.employeeId,
        date,
        status,
      });
      toast.success(`Attendance marked as ${status} for ${employee.fullName}`);
      setSelectedEmployee('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one employee');
      return;
    }

    try {
      setSubmitting(true);
      
      const employeeIds = Array.from(selectedIds).map(id => {
          const emp = employees.find(e => e.id === id);
          return emp?.employeeId;
      }).filter((id): id is string => !!id);

      await attendanceApi.bulkMark({
        employeeIds,
        date,
        status,
        overwrite: true
      });
      
      toast.success(`Marked attendance for ${employeeIds.length} employees`);
      setSelectedIds(new Set());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark bulk attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
      if (selectedIds.size === filteredEmployees.length) {
          setSelectedIds(new Set());
      } else {
          setSelectedIds(new Set(filteredEmployees.map(e => e.id)));
      }
  };

  if (loading) return <Loading message="Loading employees..." />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchEmployees} />;

  if (employees.length === 0) {
    return (
      <EmptyState
        title="No employees found"
        description="Add employees first to mark their attendance"
      />
    );
  }

  return (
    <PageTransition>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">Mark Attendance</h1>
            <p className="mt-1 text-sm text-slate-500">Record daily attendance for employees</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                  onClick={() => setMode('single')}
                  className={clsx(
                      "px-4 py-2 text-sm font-medium rounded-md transition-all",
                      mode === 'single' ? "bg-white text-brand-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
              >
                  Single Entry
              </button>
              <button
                  onClick={() => setMode('bulk')}
                  className={clsx(
                      "px-4 py-2 text-sm font-medium rounded-md transition-all",
                      mode === 'bulk' ? "bg-white text-brand-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
              >
                  Bulk Entry
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Configuration */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-soft p-6 space-y-6 sticky top-24">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-500" />
                    Attendance Details
                </h3>
                
                {/* Date Picker */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date *
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={(() => {
                            const d = new Date();
                            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                            return d.toISOString().split('T')[0];
                        })()}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                </div>

                {/* Status Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <label className={clsx(
                            "flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                            status === 'present' 
                                ? "bg-green-50 border-green-200 text-green-700 ring-2 ring-green-500 ring-offset-1" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}>
                            <input
                                type="radio"
                                name="status"
                                value="present"
                                checked={status === 'present'}
                                onChange={() => setStatus('present')}
                                className="sr-only"
                            />
                            <CheckCircle size={18} />
                            <span className="font-medium">Present</span>
                        </label>
                        
                        <label className={clsx(
                            "flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                            status === 'absent' 
                                ? "bg-red-50 border-red-200 text-red-700 ring-2 ring-red-500 ring-offset-1" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}>
                            <input
                                type="radio"
                                name="status"
                                value="absent"
                                checked={status === 'absent'}
                                onChange={() => setStatus('absent')}
                                className="sr-only"
                            />
                            <XCircle size={18} />
                            <span className="font-medium">Absent</span>
                        </label>
                    </div>
                </div>

                {mode === 'single' ? (
                     <div className="pt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Select Employee *
                        </label>
                         <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                        >
                            <option value="">Choose an employee...</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.fullName} ({employee.employeeId})
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleSingleSubmit}
                            disabled={submitting || !selectedEmployee}
                            className="w-full mt-6 px-4 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-700 active:bg-brand-900 focus:ring-4 focus:ring-brand-500/20 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium transform active:scale-[0.98]"
                        >
                            {submitting ? 'Marking...' : 'Mark Attendance'}
                        </button>
                    </div>
                ) : (
                    <div className="pt-4 space-y-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-500">Selected</span>
                                <span className="text-lg font-bold text-brand-900">{selectedIds.size}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                    className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(selectedIds.size / filteredEmployees.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleBulkSubmit}
                            disabled={submitting || selectedIds.size === 0}
                            className="w-full px-4 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 font-medium"
                        >
                            {submitting ? 'Processing...' : `Mark ${selectedIds.size} Employees`}
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Right Panel: Content */}
        <div className="lg:col-span-2">
             {mode === 'single' ? (
                 <div className="bg-white rounded-xl shadow-soft p-8 h-full flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center">
                          <User size={48} className="text-brand-300" />
                      </div>
                      <div className="max-w-md">
                          <h3 className="text-xl font-semibold text-slate-900">Single Entry Mode</h3>
                          <p className="text-slate-500 mt-2">
                              Select an employee from the dropdown on the left, choose the date and status, and click apply to mark attendance individually.
                          </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8">
                           <div className="bg-slate-50 p-4 rounded-lg">
                               <p className="text-xs text-slate-500 uppercase tracking-wide">Today's Date</p>
                               <p className="font-semibold text-slate-900">{new Date().toLocaleDateString()}</p>
                           </div>
                           <div className="bg-slate-50 p-4 rounded-lg">
                               <p className="text-xs text-slate-500 uppercase tracking-wide">Total Staff</p>
                               <p className="font-semibold text-slate-900">{employees.length}</p>
                           </div>
                      </div>
                 </div>
             ) : (
                 <div className="bg-white rounded-xl shadow-soft flex flex-col h-[600px]">
                     <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                         <div className="relative flex-1">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                             <input
                                 type="text"
                                 placeholder="Search employees..."
                                 value={bulkSearch}
                                 onChange={(e) => setBulkSearch(e.target.value)}
                                 className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                             />
                         </div>
                         <button
                            onClick={toggleAll}
                            className="px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                            {selectedIds.size === filteredEmployees.length ? 'Deselect All' : 'Select All'}
                        </button>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto p-2">
                         <div className="space-y-2">
                             {filteredEmployees.map(employee => (
                                 <div 
                                    key={employee.id}
                                    onClick={() => toggleSelection(employee.id)}
                                    className={clsx(
                                        "flex items-center p-3 rounded-lg border cursor-pointer transition-all group",
                                        selectedIds.has(employee.id) 
                                            ? "bg-brand-50 border-brand-200 ring-1 ring-brand-200" 
                                            : "bg-white border-slate-100 hover:border-brand-200 hover:shadow-sm"
                                    )}
                                 >
                                     <div className={clsx(
                                         "w-5 h-5 rounded border flex items-center justify-center mr-4 transition-colors",
                                         selectedIds.has(employee.id)
                                            ? "bg-brand-500 border-brand-500 text-white"
                                            : "border-slate-300 group-hover:border-brand-400"
                                     )}>
                                         {selectedIds.has(employee.id) && <Check size={14} />}
                                     </div>
                                     <div className="flex-1">
                                         <p className="font-medium text-slate-900">{employee.fullName}</p>
                                         <p className="text-xs text-slate-500">{employee.employeeId} • {employee.department}</p>
                                     </div>
                                     {employee.statusOnDate && (
                                         <div className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500">
                                             {employee.statusOnDate}
                                         </div>
                                     )}
                                 </div>
                             ))}
                             
                             {filteredEmployees.length === 0 && (
                                 <div className="text-center py-12 text-slate-500">
                                     No employees found matching "{bulkSearch}"
                                 </div>
                             )}
                         </div>
                     </div>
                     
                     <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl text-xs text-slate-500 text-center">
                         Showing {filteredEmployees.length} of {employees.length} employees
                     </div>
                 </div>
             )}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
