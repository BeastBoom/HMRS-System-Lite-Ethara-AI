// Employee types
export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;

  department: string;
  createdAt: string;
  statusOnDate?: 'present' | 'absent' | null;
}

export interface Department {
  id: string;
  name: string;
}

export interface DepartmentDistributionItem {
  name: string;
  count: number;
}

export interface EmployeeCreate {
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Attendance types
export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
}

export interface AttendanceCreate {
  employeeId: string;
  date: string;
  status: 'present' | 'absent';
}

export interface AttendanceListResponse {
  attendance: AttendanceRecord[];
}

export interface AttendanceResponse {
  id: string;
  employeeId: string;
  date: string;
  status: string;
}

export interface CalendarMetrics {
  presentDays: number;
  absentDays: number;
  attendancePercent: number;
}

export interface EmployeeCalendarResponse {
  attendance: AttendanceRecord[];
  metrics: CalendarMetrics;
}

// Dashboard types
export interface DashboardSummary {
  totalEmployees: number;
  todayPresent: number;
  monthPresent: number;
  avgAttendancePercent: number;
}

export interface TrendDataPoint {
  date: string;
  present: number;
  absent: number;
}

export interface AttendanceBulkCreate {
  date: string;
  items: {
      employeeId: string;
      status: 'present' | 'absent';
  }[];
}

export interface AttendanceBulkResponse {
  count: number;
  message: string;
}

export interface DashboardTrendsResponse {
  series: TrendDataPoint[];
}

// API Error types
export interface ApiErrorDetail {
  code: string;
  message: string;
  userMessage?: string;
}

export interface ApiError {
  error: ApiErrorDetail;
}

// Health check
export interface HealthResponse {
  status: string;
}
