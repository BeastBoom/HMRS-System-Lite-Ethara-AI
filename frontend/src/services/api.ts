import axios, { AxiosError } from 'axios';
import type {
  Employee,
  EmployeeCreate,
  EmployeeListResponse,
  AttendanceCreate,
  AttendanceListResponse,
  AttendanceResponse,
  ApiError,
  DashboardSummary,
  DashboardTrendsResponse,
  EmployeeCalendarResponse,
  Department,
  DepartmentDistributionItem,
  AttendanceBulkCreate,
  AttendanceBulkResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error: AxiosError<ApiError>): never => {
  if (error.response?.data?.error) {
    const { message, userMessage } = error.response.data.error;
    throw new Error(userMessage || message);
  }
  throw new Error(error.message || 'An unexpected error occurred');
};

// Employee API
export const employeeApi = {
  getAll: async (params?: { query?: string; date?: string; page?: number; limit?: number }): Promise<EmployeeListResponse> => {
    try {
      const response = await api.get<EmployeeListResponse>('/api/employees', { params });
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  },

  getById: async (id: string): Promise<Employee> => {
    try {
      const response = await api.get<Employee>(`/api/employees/${id}`);
      return response.data;
    } catch (error) {
       return handleError(error as AxiosError<ApiError>);
    }
  },

  create: async (data: EmployeeCreate): Promise<Employee> => {
    try {
      const response = await api.post<Employee>('/api/employees', data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  },

  update: async (id: string, data: Partial<EmployeeCreate>): Promise<Employee> => {
    try {
      const response = await api.patch<Employee>(`/api/employees/${id}`, data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/employees/${id}`);
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  },

  getCalendar: async (
    id: string,
    from?: string,
    to?: string
  ): Promise<EmployeeCalendarResponse> => {
    try {
      const params: any = {};
      if (from) params.from = from;
      if (to) params.to = to;
      
      const response = await api.get<EmployeeCalendarResponse>(`/api/employees/${id}/calendar`, { params });
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  },
  
  // Legacy support if needed, or alias to getCalendar's attendance part
  getAttendance: async (
    id: string,
    from?: string,
    to?: string
  ): Promise<AttendanceListResponse> => {
      try {
        const params: any = {};
        if (from) params.from = from;
        if (to) params.to = to;
        const response = await api.get<AttendanceListResponse>(`/api/employees/${id}/attendance`, { params });
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError<ApiError>);
      }
  }
};

// Department API
export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    try {
      const response = await api.get<Department[]>('/api/departments');
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  }
};


// Attendance API
export const attendanceApi = {
  mark: async (data: AttendanceCreate): Promise<AttendanceResponse> => {
    try {
      const response = await api.post<AttendanceResponse>('/api/attendance', data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  },
  
  bulkMark: async (data: AttendanceBulkCreate): Promise<AttendanceBulkResponse> => {
    try {
      const response = await api.post<AttendanceBulkResponse>('/api/attendance/bulk', data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  },

  update: async (data: { employeeId: string; date: string; status: string }): Promise<AttendanceResponse> => {
    try {
      const response = await api.patch<AttendanceResponse>('/api/attendance', data);
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  },

  getByDate: async (employeeId: string, date: string): Promise<AttendanceResponse> => {
    try {
      const response = await api.get<AttendanceResponse>('/api/attendance', { params: { employeeId, date } });
      return response.data;
    } catch (error) {
      // Return null or throw specific 404? 
      // api.ts usually throws basic error via handleError. 
      // Let's stick to standard error handling, component handles 404 if needed.
      return handleError(error as AxiosError<ApiError>);
    }
  }
};

// Dashboard API
export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    try {
      const response = await api.get<DashboardSummary>('/api/dashboard/summary');
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  },
  getTrends: async (from: string, to: string): Promise<DashboardTrendsResponse> => {
    try {
      const response = await api.get<DashboardTrendsResponse>('/api/dashboard/trends', { params: { from, to } });
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>);
    }
  },
  getDistribution: async (): Promise<DepartmentDistributionItem[]> => {
    try {
      const response = await api.get<DepartmentDistributionItem[]>('/api/dashboard/departments');
      return response.data;
    } catch (error) {
       return handleError(error as AxiosError<ApiError>);
    }
  }
}

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.data.status === 'ok';
  } catch {
    return false;
  }
};

export default api;
