import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Briefcase,
  Calendar as CalendarIcon,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

import { employeeApi } from '../services/api';
import type { Employee, EmployeeCalendarResponse } from '../types';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import { PageTransition } from '../components/ui/PageTransition';
import { MetricCard } from '../components/ui/MetricCard';

import 'react-day-picker/dist/style.css';

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [calendarData, setCalendarData] = useState<EmployeeCalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch profile and calendar data (defaults to all/current range)
        const [emp, cal] = await Promise.all([
          employeeApi.getById(id),
          employeeApi.getCalendar(id)
        ]);
        setEmployee(emp);
        setCalendarData(cal);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading message="Loading details..." />;
  if (error) return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  if (!employee) return <ErrorDisplay message="Employee not found" />;

  // Create a map of date-string -> status for the calendar modifiers
  const attendanceMap = new Map<string, string>();
  if (calendarData) {
    calendarData.attendance.forEach(record => {
      attendanceMap.set(record.date, record.status);
    });
  }

  // Custom modifiers for DayPicker
  const modifiers = {
    present: (date: Date) => attendanceMap.get(format(date, 'yyyy-MM-dd')) === 'present',
    absent: (date: Date) => attendanceMap.get(format(date, 'yyyy-MM-dd')) === 'absent',
  };

  const modifiersClassNames = {
    present: 'bg-brand-100 text-brand-700 font-bold hover:bg-brand-200',
    absent: 'bg-red-100 text-red-700 font-bold hover:bg-red-200',
  };

  const handleDayClick = (day: Date | undefined) => {
      setSelectedDay(day);
  };

  const selectedDayStatus = selectedDay 
    ? attendanceMap.get(format(selectedDay, 'yyyy-MM-dd')) 
    : null;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <button
          onClick={() => navigate('/employees')}
          className="flex items-center text-slate-500 hover:text-slate-700 transition-colors mb-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back to list
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile & Metrics */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-soft p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-brand-300/30 rounded-full flex items-center justify-center text-3xl font-bold text-brand-700 mb-4">
                  {employee.fullName.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{employee.fullName}</h2>
                <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {employee.department}
                </div>
              </div>

              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center text-slate-600">
                  <User size={18} className="mr-3 text-slate-400" />
                  <span className="text-sm">{employee.employeeId}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Mail size={18} className="mr-3 text-slate-400" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Briefcase size={18} className="mr-3 text-slate-400" />
                  <span className="text-sm">{employee.department}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <CalendarIcon size={18} className="mr-3 text-slate-400" />
                  <span className="text-sm">Joined {format(parseISO(employee.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </motion.div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
               <MetricCard 
                  title="Attendance"
                  value={`${calendarData?.metrics.attendancePercent || 0}%`}
                  color="primary"
               />
               <MetricCard
                  title="Present Days"
                  value={calendarData?.metrics.presentDays || 0}
                  color="primary"
               />
               <MetricCard
                  title="Absent Days"
                  value={calendarData?.metrics.absentDays || 0}
                  color="accent"
               />
            </div>
          </div>

          {/* Right Column: Calendar */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white rounded-lg shadow-soft p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Attendance Calendar</h3>
              <div className="flex flex-col md:flex-row gap-8">
                 <div className="flex-1 flex justify-center">
                    <DayPicker
                        mode="single"
                        selected={selectedDay}
                        onSelect={handleDayClick}
                        required={false}
                        modifiers={modifiers}
                        modifiersClassNames={modifiersClassNames}
                        classNames={{
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md transition-colors",
                          selected: "bg-brand-900 text-white hover:bg-brand-800 focus:bg-brand-900",
                          today: "bg-slate-100 text-slate-900 font-bold",
                        }}
                    />
                 </div>
                 
                 {/* Selected Day Details */}
                 <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                    <h4 className="font-semibold text-slate-900 mb-4">
                        {selectedDay ? format(selectedDay, 'MMMM d, yyyy') : 'Select a date'}
                    </h4>
                    
                    {selectedDay ? (
                        <div className="space-y-4">
                            {selectedDayStatus ? (
                                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                                    selectedDayStatus === 'present' ? 'bg-green-50' : 'bg-red-50'
                                }`}>
                                    {selectedDayStatus === 'present' ? (
                                        <CheckCircle className="text-green-600 mt-0.5" size={20} />
                                    ) : (
                                        <XCircle className="text-red-600 mt-0.5" size={20} />
                                    )}
                                    <div>
                                        <p className={`font-medium ${
                                            selectedDayStatus === 'present' ? 'text-green-900' : 'text-red-900'
                                        }`}>
                                            {selectedDayStatus.charAt(0).toUpperCase() + selectedDayStatus.slice(1)}
                                        </p>
                                        <p className={`text-sm mt-1 ${
                                            selectedDayStatus === 'present' ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            Recorded via System
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-lg bg-slate-50 flex items-start gap-3">
                                    <Clock className="text-slate-400 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-medium text-slate-700">No Record</p>
                                        <p className="text-sm mt-1 text-slate-500">
                                            No attendance data found for this date.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">
                            Click on a date in the calendar to view attendance details.
                        </p>
                    )}
                    
                    <div className="mt-8">
                        <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Legend</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-200"></span>
                                <span className="text-slate-600">Present</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-200"></span>
                                <span className="text-slate-600">Absent</span>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
