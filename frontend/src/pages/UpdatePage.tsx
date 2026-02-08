import { useState, useEffect } from 'react';
import { PageTransition } from '../components/ui/PageTransition';
import { Search, User, Calendar, Edit2, Loader2, Save } from 'lucide-react';
import { employeeApi, departmentApi, attendanceApi } from '../services/api';
import { toast } from 'react-hot-toast';
import type { Employee, Department, AttendanceResponse } from '../types';
import clsx from 'clsx';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function UpdatePage() {
  // --- Employee Update State ---
  const [empQuery, setEmpQuery] = useState('');
  const [isSearchingEmp, setIsSearchingEmp] = useState(false);
  const [empResults, setEmpResults] = useState<Employee[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [empForm, setEmpForm] = useState({ fullName: '', email: '', department: '' });
  const [savingEmp, setSavingEmp] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  // --- Attendance Update State ---
  const [attQuery, setAttQuery] = useState('');
  const [isSearchingAtt, setIsSearchingAtt] = useState(false);
  const [attResults, setAttResults] = useState<Employee[]>([]);
  const [selectedAttEmp, setSelectedAttEmp] = useState<Employee | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecord, setAttendanceRecord] = useState<AttendanceResponse | null>(null);
  const [loadingAtt, setLoadingAtt] = useState(false);
  const [savingAtt, setSavingAtt] = useState(false);
  const [attStatus, setAttStatus] = useState<'present' | 'absent'>('present');
  const [showCalendar, setShowCalendar] = useState(false);

  // --- Effects ---

  // Fetch Departments
  useEffect(() => {
    departmentApi.getAll().then(setDepartments).catch(console.error);
  }, []);

  // Debounce Employee Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (empQuery.trim().length < 2) {
        setEmpResults([]);
        return;
      }
      setIsSearchingEmp(true);
      try {
        const res = await employeeApi.getAll({ query: empQuery, limit: 10 });
        setEmpResults(res.employees);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearchingEmp(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [empQuery]);

  // Debounce Attendance Employee Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (attQuery.trim().length < 2) {
        setAttResults([]);
        return;
      }
      setIsSearchingAtt(true);
      try {
        const res = await employeeApi.getAll({ query: attQuery, limit: 10 });
        setAttResults(res.employees);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearchingAtt(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [attQuery]);

  // Fetch Attendance when Employee or Date changes
  useEffect(() => {
    if (!selectedAttEmp || !selectedDate) return;

    const fetchAttendance = async () => {
      setLoadingAtt(true);
      setAttendanceRecord(null);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      try {
        const res = await attendanceApi.getByDate(selectedAttEmp.employeeId, dateStr);
        setAttendanceRecord(res);
        setAttStatus(res.status as 'present' | 'absent');
      } catch {
        // 404 is expected if no record
        setAttendanceRecord(null);
        setAttStatus('present'); // Default for new
      } finally {
        setLoadingAtt(false);
      }
    };

    fetchAttendance();
  }, [selectedAttEmp, selectedDate]);


  // --- Handlers: Employee Update ---

  const handleSelectEmp = (emp: Employee) => {
    setSelectedEmp(emp);
    setEmpForm({
      fullName: emp.fullName,
      email: emp.email,
      department: emp.department
    });
    setEmpQuery(''); 
    setEmpResults([]);
  };

  const handleUpdateEmp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    setSavingEmp(true);
    try {
      const updated = await employeeApi.update(selectedEmp.id, empForm);
      toast.success("Employee updated successfully");
      setSelectedEmp(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update employee");
    } finally {
      setSavingEmp(false);
    }
  };

  // --- Handlers: Attendance Update ---

  const handleSelectAttEmp = (emp: Employee) => {
    setSelectedAttEmp(emp);
    setAttQuery('');
    setAttResults([]);
  };

  const handleUpdateAttendance = async () => {
    if (!selectedAttEmp) return;
    
    setSavingAtt(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    try {
      if (attendanceRecord) {
        // Update existing
         await attendanceApi.update({
          employeeId: selectedAttEmp.employeeId, // Use string ID for API
          date: dateStr,
          status: attStatus
        });
        toast.success("Attendance updated");
      } else {
        // Create new
         await attendanceApi.mark({
          employeeId: selectedAttEmp.employeeId,
          date: dateStr,
          status: attStatus
        });
        toast.success("Attendance marked");
      }
      
      // Refresh record
      const res = await attendanceApi.getByDate(selectedAttEmp.employeeId, dateStr);
      setAttendanceRecord(res);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save attendance");
    } finally {
      setSavingAtt(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Update Records</h1>
          <p className="mt-1 text-sm text-slate-500">
            Search and modify employee details or attendance records.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* --- Left Column: Update Employee --- */}
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-6 border border-slate-100 flex flex-col h-full">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-brand-50 rounded-lg">
                <User className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Update Employee</h2>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={empQuery}
                  onChange={(e) => setEmpQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm transition-all"
                />
              </div>
              
              {/* Emp Search Results */}
              {(isSearchingEmp || empResults.length > 0) && empQuery.length >= 2 && (
                <div className="bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-20 relative">
                   {isSearchingEmp ? (
                      <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                   ) : empResults.length > 0 ? (
                      <ul className="py-1">
                        {empResults.map(emp => (
                          <li 
                            key={emp.id}
                            onClick={() => handleSelectEmp(emp)}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <div className="font-medium text-slate-900 text-sm">{emp.fullName}</div>
                              <div className="text-xs text-slate-500">{emp.employeeId} • {emp.department}</div>
                            </div>
                            <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-brand-600" />
                          </li>
                        ))}
                      </ul>
                   ) : (
                      <div className="p-4 text-center text-sm text-slate-500">No employees found</div>
                   )}
                </div>
              )}
               
              {selectedEmp ? (
                 <form onSubmit={handleUpdateEmp} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="pt-2 pb-2">
                       <div className="flex items-center gap-3 p-3 bg-brand-50/50 rounded-lg border border-brand-100">
                          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                            {selectedEmp.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-brand-900">{selectedEmp.fullName}</div>
                            <div className="text-xs text-brand-600/80">{selectedEmp.employeeId}</div>
                          </div>
                          <button
                            type="button" 
                            onClick={() => setSelectedEmp(null)}
                            className="ml-auto text-xs text-slate-400 hover:text-red-500"
                           >
                            Change
                          </button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            value={empForm.fullName}
                            onChange={e => setEmpForm({...empForm, fullName: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm"
                            required
                        />
                        </div>
                        <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email"
                            value={empForm.email}
                            onChange={e => setEmpForm({...empForm, email: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm"
                            required
                        />
                        </div>
                        <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                        <select
                            value={empForm.department}
                            onChange={e => setEmpForm({...empForm, department: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm"
                        >
                            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                        </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={savingEmp}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {savingEmp ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                      </button>
                    </div>
                 </form>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                     <Search className="w-5 h-5 text-slate-300" />
                   </div>
                   <p className="text-sm font-medium text-slate-900">No employee selected</p>
                   <p className="text-xs text-slate-500 mt-1">Search to edit details</p>
                 </div>
               )}
            </div>
          </div>

          {/* --- Right Column: Update Attendance --- */}
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-6 border border-slate-100 flex flex-col h-full">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-accent-50 rounded-lg">
                <Calendar className="w-5 h-5 text-accent-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Update Attendance</h2>
            </div>
            
            <div className="space-y-4 flex-1">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                    type="text"
                    placeholder="Search employee for attendance..."
                    value={attQuery}
                    onChange={(e) => setAttQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none text-sm transition-all"
                    />
                </div>

                {/* Att Search Results */}
                {(isSearchingAtt || attResults.length > 0) && attQuery.length >= 2 && (
                    <div className="bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-20 relative">
                    {isSearchingAtt ? (
                        <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                    ) : attResults.length > 0 ? (
                        <ul className="py-1">
                            {attResults.map(emp => (
                            <li 
                                key={emp.id}
                                onClick={() => handleSelectAttEmp(emp)}
                                className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                            >
                                <div>
                                <div className="font-medium text-slate-900 text-sm">{emp.fullName}</div>
                                <div className="text-xs text-slate-500">{emp.employeeId}</div>
                                </div>
                                <Calendar className="w-4 h-4 text-slate-300 group-hover:text-accent-600" />
                            </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-sm text-slate-500">No employees found</div>
                    )}
                    </div>
                )}

                {selectedAttEmp ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Selected User Header */}
                        <div className="flex items-center gap-3 p-3 bg-accent-50/50 rounded-lg border border-accent-100">
                            <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-sm">
                                {selectedAttEmp.fullName.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-brand-900">{selectedAttEmp.fullName}</div>
                                <div className="text-xs text-brand-600/80">{selectedAttEmp.employeeId}</div>
                            </div>
                            <button
                                type="button" 
                                onClick={() => setSelectedAttEmp(null)}
                                className="ml-auto text-xs text-slate-400 hover:text-red-500"
                            >
                                Change
                            </button>
                        </div>

                        {/* Date Picker */}
                        <div className="space-y-2 relative">
                            <label className="block text-xs font-medium text-slate-700">Date</label>
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                className="w-full flex items-center justify-between px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
                            >
                                <span>{format(selectedDate, 'PPP')}</span>
                                <Calendar className="w-4 h-4 text-slate-400" />
                            </button>
                            
                            {showCalendar && (
                                <div className="absolute top-full left-0 mt-2 p-2 bg-white border rounded-lg shadow-xl z-20">
                                    <DayPicker
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(d) => {
                                            if(d) setSelectedDate(d);
                                            setShowCalendar(false);
                                        }}
                                        disabled={{ after: new Date() }} // Cannot mark future?
                                    />
                                </div>
                            )}
                        </div>

                        {/* Status Editor */}
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                             {loadingAtt ? (
                                 <div className="flex items-center justify-center py-4">
                                     <Loader2 className="animate-spin text-slate-400" />
                                 </div>
                             ) : (
                                 <div className="space-y-4">
                                     <div className="flex items-center justify-between">
                                         <span className="text-sm font-medium text-slate-700">Status</span>
                                         {attendanceRecord ? (
                                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Recorded</span>
                                         ) : (
                                              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Not Recorded</span>
                                         )}
                                     </div>
                                     
                                     <div className="flex gap-2">
                                         <button
                                            type="button"
                                            onClick={() => setAttStatus('present')}
                                            className={clsx(
                                                "flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-all",
                                                attStatus === 'present' 
                                                    ? "bg-green-600 text-white border-green-600 shadow-sm" 
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-green-300"
                                            )}
                                         >
                                             Present
                                         </button>
                                         <button
                                            type="button"
                                            onClick={() => setAttStatus('absent')}
                                            className={clsx(
                                                "flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-all",
                                                attStatus === 'absent' 
                                                    ? "bg-red-600 text-white border-red-600 shadow-sm" 
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-red-300"
                                            )}
                                         >
                                             Absent
                                         </button>
                                     </div>
                                 </div>
                             )}
                        </div>

                        <div className="pt-2">
                             <button 
                                 onClick={handleUpdateAttendance}
                                 disabled={savingAtt || loadingAtt}
                                 className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium disabled:opacity-50"
                             >
                                 {savingAtt ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                 {attendanceRecord ? 'Update Record' : 'Mark Attendance'}
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                            <Search className="w-5 h-5 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-900">No employee selected</p>
                        <p className="text-xs text-slate-500 mt-1">Search to manage attendance</p>
                    </div>
                )}
            </div>
          </div>
          
        </div>
      </div>
    </PageTransition>
  );
}
