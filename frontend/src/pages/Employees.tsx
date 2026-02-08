import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { employeeApi } from '../services/api';
import type { Employee, EmployeeCreate } from '../types';
import ErrorDisplay from '../components/ErrorDisplay';
import { EmployeeList } from '../components/Employee/EmployeeList';
import { DepartmentSelector } from '../components/DepartmentSelector';
import { PageTransition } from '../components/ui/PageTransition';
import { Plus } from 'lucide-react';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter/Pagination State
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Modal State (Add)
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<EmployeeCreate>({
    employeeId: '',
    fullName: '',
    email: '',
    department: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<EmployeeCreate>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await employeeApi.getAll({
          page,
          limit,
          query: query || undefined,
      });
      
      setEmployees(response.employees);
      if (response.meta) {
          setTotal(response.meta.total);
      } else {
          setTotal(response.employees.length);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Reset page when filters change
  useEffect(() => {
      setPage(1);
  }, [query]);

  const validateForm = (): boolean => {
    const errors: Partial<EmployeeCreate> = {};
    
    if (!formData.employeeId.trim()) {
      errors.employeeId = 'Employee ID is required';
    }
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await employeeApi.create({
        ...formData,
        email: formData.email.toLowerCase().trim(),
      });
      toast.success('Employee created successfully');
      setShowModal(false);
      setFormData({ employeeId: '', fullName: '', email: '', department: '' });
      setFormErrors({});
      fetchEmployees();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this employee?')) return;
      await employeeApi.delete(id);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete employee');
    }
  };
  
  // Enforce Update Page for edits
  const handleEdit = () => {
      navigate('/update'); 
      toast('Please use the Update page to edit employee details.', {
        icon: '📝',
        duration: 4000
      });
  };

  const handleView = (id: string) => {
      navigate(`/employees/${id}`);
  };
  
  if (error) return <ErrorDisplay message={error} onRetry={fetchEmployees} />;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 sticky top-20 z-20">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">Employees</h1>
            <p className="mt-1 text-sm text-slate-500">Manage your team members and attendance</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="hidden sm:inline-flex items-center px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-700 hover:scale-105 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Employee
          </button>
        </div>

        <EmployeeList
            employees={employees}
            loading={loading}
            total={total}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onSearch={setQuery}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
        />

        {/* Mobile FAB */}
        <button
          onClick={() => setShowModal(true)}
          className="sm:hidden fixed bottom-6 right-6 p-4 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-700 hover:scale-110 active:scale-95 transition-all z-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          aria-label="Add employee"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Add Employee Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                onClick={() => setShowModal(false)}
              />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Add New Employee</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        value={formData.employeeId}
                        onChange={(e) =>
                          setFormData({ ...formData, employeeId: e.target.value })
                        }
                        placeholder="e.g., E1001"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
                          formErrors.employeeId ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {formErrors.employeeId && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.employeeId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="e.g., John Doe"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
                          formErrors.fullName ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="e.g., john@example.com"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all ${
                          formErrors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Department *
                      </label>
                        <DepartmentSelector 
                          value={formData.department}
                          onChange={(val) => setFormData({ ...formData, department: val })}
                          error={formErrors.department}
                        />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setFormErrors({});
                      }}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-brand-700 rounded-lg hover:bg-brand-900 transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Creating...' : 'Create Employee'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
