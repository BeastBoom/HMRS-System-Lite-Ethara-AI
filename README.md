# HRMS-Lite (Human Resource Management System)

A lightweight, production-ready MVP for managing employees and tracking attendance. Built with FastAPI, React, and PostgreSQL.

## 🎯 Features

- **Employee Management**: Add, view, update, and delete employee records
- **Attendance Tracking**: Mark daily attendance (present/absent) for employees
- **Dashboard Analytics**: View attendance trends, department distribution, and key metrics
- **Bulk Operations**: Mark attendance for multiple employees at once
- **Department Management**: Organize employees by departments
- **Real-time Validation**: Comprehensive input validation and error handling
- **Responsive UI**: Modern, mobile-friendly interface built with React and TailwindCSS

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Backend** | FastAPI (Python) |
| **Database** | PostgreSQL |
| **Frontend** | React + TypeScript + Vite + TailwindCSS |
| **Backend Hosting** | Render |
| **Frontend Hosting** | Vercel |
| **Database Hosting** | Supabase |

## 🌐 Live URLs

```json
{
  "frontend_url": "<TO_BE_DEPLOYED>",
  "backend_url": "<TO_BE_DEPLOYED>",
  "repo": "<TO_BE_CREATED>"
}
```

> **Note**: Follow the deployment instructions below to get live URLs.

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── models.py            # SQLAlchemy database models
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── database.py          # Database connection setup
│   │   └── routers/             # API route handlers
│   │       ├── employees.py     # Employee endpoints
│   │       ├── attendance.py    # Attendance endpoints
│   │       ├── dashboard.py     # Dashboard analytics
│   │       └── departments.py   # Department endpoints
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables
│   └── README.md                # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service layer
│   │   └── types/               # TypeScript type definitions
│   ├── package.json             # Node dependencies
│   ├── .env                     # Environment variables
│   └── README.md                # Frontend documentation
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL** - Local installation or cloud database (e.g., Supabase, Neon)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hrms-lite
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create a .env file with:
# DATABASE_URL=postgresql://user:password@localhost:5432/hrms_db
# ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Start the server (tables will be created automatically)
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative Docs: `http://localhost:8000/redoc`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Configure environment variables
# Create a .env file with:
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
# or
pnpm dev
```

The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Health & System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/docs` | Swagger API documentation |

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees (with pagination, search, filters) |
| POST | `/api/employees` | Create new employee |
| GET | `/api/employees/{id}` | Get employee by ID |
| PATCH | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| GET | `/api/employees/{id}/attendance` | Get employee attendance history |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | Get attendance by employee ID and date |
| POST | `/api/attendance` | Mark attendance for an employee |
| PATCH | `/api/attendance` | Update attendance record |
| POST | `/api/attendance/bulk` | Bulk mark attendance for multiple employees |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Get dashboard summary metrics |
| GET | `/api/dashboard/trends` | Get attendance trends over time |
| GET | `/api/dashboard/distribution` | Get department distribution |

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | List all departments |

## 📋 API Usage Examples

### Create Employee

```bash
curl -X POST http://localhost:8000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "E1001",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "department": "IT"
  }'
```

### Mark Attendance

```bash
curl -X POST http://localhost:8000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "E1001",
    "date": "2026-02-08",
    "status": "present"
  }'
```

### Get Dashboard Summary

```bash
curl http://localhost:8000/api/dashboard/summary
```

### Bulk Mark Attendance

```bash
curl -X POST http://localhost:8000/api/attendance/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "employeeIds": ["E1001", "E1002", "E1003"],
    "date": "2026-02-08",
    "status": "present",
    "overwrite": false
  }'
```

## 🗄️ Database Schema

### `employees` Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| employee_id | VARCHAR | UNIQUE, NOT NULL |
| full_name | VARCHAR | NOT NULL |
| email | VARCHAR | UNIQUE, NOT NULL |
| department_id | INTEGER | FK → departments.id |
| created_at | TIMESTAMP | DEFAULT NOW() |

### `attendance` Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| employee_id | UUID | FK → employees.id |
| date | DATE | NOT NULL |
| status | ENUM | 'present' or 'absent' |
| created_at | TIMESTAMP | DEFAULT NOW() |

**Unique Constraint**: `(employee_id, date)` - One attendance record per employee per day

### `departments` Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| name | VARCHAR | UNIQUE, NOT NULL |

**Default Departments**: IT, Management, Sales, HR, Finance, Product, Operations, Support, Marketing, Design

## 🚢 Deployment

### Backend Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://your-app.vercel.app`)

### Frontend Deployment (Vercel)

1. Create a new project on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-api.onrender.com`)

### Database Setup (Supabase/Neon)

1. Create a PostgreSQL database on [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. Copy the connection string
3. Use it as `DATABASE_URL` in your backend environment variables
4. Tables will be created automatically when the backend starts

## 🔧 Troubleshooting

### Backend Issues

**Database connection fails**
- Verify `DATABASE_URL` is correct in `.env`
- Ensure PostgreSQL is running
- Check firewall/network settings

**Tables not created**
- Tables are created automatically via `Base.metadata.create_all()` on startup
- Check server logs for errors
- Verify database user has CREATE TABLE permissions

**CORS errors**
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Format: `http://localhost:5173,https://your-frontend.vercel.app`

### Frontend Issues

**API calls fail**
- Verify `VITE_API_URL` in `.env` points to your backend
- Check if backend is running
- Open browser console for detailed error messages

**Build fails**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`

## 📝 Development Notes

### Database Migrations

This MVP uses SQLAlchemy's `Base.metadata.create_all()` for automatic table creation. For production deployments with existing data, consider implementing a proper migration system.

### Authentication

This MVP does not include authentication. For production use, implement:
- JWT-based authentication
- Role-based access control (RBAC)
- Session management

### Testing

Add comprehensive tests before production deployment:
- Backend: pytest with test database
- Frontend: Vitest + React Testing Library
- E2E: Playwright or Cypress

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using FastAPI and React**
