# HRMS-Lite Backend

FastAPI-based backend for the Human Resource Management System. Provides RESTful APIs for employee management, attendance tracking, and dashboard analytics.

## 🎯 Features

- **RESTful API**: Clean, well-documented endpoints following REST principles
- **Automatic Schema Creation**: Database tables created automatically on startup
- **Input Validation**: Comprehensive validation using Pydantic schemas
- **Error Handling**: Consistent error responses with detailed messages
- **CORS Support**: Configurable cross-origin resource sharing
- **Auto-generated Docs**: Interactive API documentation via Swagger UI and ReDoc

## 🛠️ Technology Stack

- **Framework**: FastAPI 0.109.2
- **Database**: PostgreSQL (via SQLAlchemy 2.0.25)
- **Validation**: Pydantic 2.6.1
- **Server**: Uvicorn 0.27.1
- **Database Driver**: psycopg2-binary 2.9.9

## 📁 Project Structure

```
backend/
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI application & startup logic
│   ├── database.py          # Database connection & session management
│   ├── models.py            # SQLAlchemy ORM models
│   ├── schemas.py           # Pydantic validation schemas
│   └── routers/
│       ├── __init__.py
│       ├── employees.py     # Employee CRUD operations
│       ├── attendance.py    # Attendance tracking
│       ├── dashboard.py     # Analytics & metrics
│       └── departments.py   # Department management
├── requirements.txt         # Python dependencies
├── .env                     # Environment configuration
└── README.md               # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Python 3.10 or higher
- PostgreSQL database (local or cloud)
- pip (Python package manager)

### 1. Create Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate

# macOS/Linux:
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/hrms_db

# CORS Configuration (comma-separated list of allowed origins)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Database URL Format:**
```
postgresql://[user]:[password]@[host]:[port]/[database_name]
```

**Examples:**
- Local: `postgresql://postgres:password@localhost:5432/hrms_db`
- Supabase: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`
- Neon: `postgresql://[user]:[password]@[host].neon.tech/[dbname]`

### 4. Start the Server

```bash
# Development mode (with auto-reload)
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# Production mode
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

The server will start on `http://localhost:8000`

**Database tables are created automatically on startup** - no manual migration needed!

### 5. Verify Installation

```bash
# Health check
curl http://localhost:8000/health

# Expected response:
# {"status":"ok"}
```

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📡 API Endpoints Reference

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

### Employees

#### List Employees
```http
GET /api/employees?page=1&limit=10&search=john&department=IT&sortBy=fullName&sortOrder=asc
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or employee ID
- `department` (optional): Filter by department name
- `sortBy` (optional): Sort field (fullName, employeeId, email, department)
- `sortOrder` (optional): asc or desc

#### Create Employee
```http
POST /api/employees
Content-Type: application/json

{
  "employeeId": "E1001",
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "department": "IT"
}
```

#### Get Employee
```http
GET /api/employees/{id}
```

#### Update Employee
```http
PATCH /api/employees/{id}
Content-Type: application/json

{
  "fullName": "John Smith",
  "email": "john.smith@example.com",
  "department": "Management"
}
```

#### Delete Employee
```http
DELETE /api/employees/{id}
```

### Attendance

#### Mark Attendance
```http
POST /api/attendance
Content-Type: application/json

{
  "employeeId": "E1001",
  "date": "2026-02-08",
  "status": "present"
}
```

#### Get Attendance
```http
GET /api/attendance?employeeId=E1001&date=2026-02-08
```

#### Update Attendance
```http
PATCH /api/attendance
Content-Type: application/json

{
  "employeeId": "E1001",
  "date": "2026-02-08",
  "status": "absent"
}
```

#### Bulk Mark Attendance
```http
POST /api/attendance/bulk
Content-Type: application/json

{
  "employeeIds": ["E1001", "E1002", "E1003"],
  "date": "2026-02-08",
  "status": "present",
  "overwrite": false
}
```

### Dashboard

#### Get Summary
```http
GET /api/dashboard/summary
```

**Response:**
```json
{
  "totalEmployees": 50,
  "todayPresent": 45,
  "monthPresent": 1200,
  "avgAttendancePercent": 90.5
}
```

#### Get Trends
```http
GET /api/dashboard/trends?from=2026-01-01&to=2026-01-31
```

#### Get Department Distribution
```http
GET /api/dashboard/distribution
```

### Departments

#### List Departments
```http
GET /api/departments
```

## 🗄️ Database Models

### Employee Model
```python
class Employee(Base):
    id: UUID (Primary Key)
    employee_id: str (Unique)
    full_name: str
    email: str (Unique)
    department_id: int (Foreign Key)
    created_at: datetime
```

### Attendance Model
```python
class Attendance(Base):
    id: UUID (Primary Key)
    employee_id: UUID (Foreign Key)
    date: date
    status: AttendanceStatus (Enum: 'present' | 'absent')
    created_at: datetime
    
    # Unique constraint on (employee_id, date)
```

### Department Model
```python
class Department(Base):
    id: int (Primary Key)
    name: str (Unique)
```

## ⚠️ Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Detailed error message",
    "userMessage": "User-friendly message (optional)"
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` (400): Invalid input data
- `NOT_FOUND` (404): Resource not found
- `DUPLICATE` (409): Duplicate entry (e.g., email already exists)
- `INTERNAL_ERROR` (500): Server error

## 🔧 Troubleshooting

### Database Connection Issues

**Error: "could not connect to server"**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Ensure database exists
- Verify network/firewall settings

**Error: "password authentication failed"**
- Check username and password in `DATABASE_URL`
- Verify user has access to the database

### Table Creation Issues

**Tables not created on startup**
- Check server logs for errors
- Verify database user has CREATE TABLE permissions
- Ensure `Base.metadata.create_all()` is called in `main.py`

### CORS Issues

**Frontend can't access API**
- Add frontend URL to `ALLOWED_ORIGINS` in `.env`
- Format: `http://localhost:5173,https://your-frontend.com`
- Restart server after changing `.env`

### Import Errors

**Error: "No module named 'src'"**
- Ensure you're running from the `backend` directory
- Use: `uvicorn src.main:app` (not `python src/main.py`)

## 🚢 Deployment

### Render Deployment

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `ALLOWED_ORIGINS`: Frontend URL(s)

### Other Platforms

**Railway:**
```bash
# Start command
uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

**Heroku:**
```bash
# Procfile
web: uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

## 🧪 Testing

### Manual Testing

```bash
# Health check
curl http://localhost:8000/health

# Create employee
curl -X POST http://localhost:8000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"TEST001","fullName":"Test User","email":"test@example.com","department":"IT"}'

# List employees
curl http://localhost:8000/api/employees

# Mark attendance
curl -X POST http://localhost:8000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"TEST001","date":"2026-02-08","status":"present"}'
```

### Automated Testing (Future)

For production, implement:
- Unit tests with pytest
- Integration tests with TestClient
- Database fixtures with pytest-postgresql

## 📝 Development Notes

### Adding New Endpoints

1. Create/update router in `src/routers/`
2. Define Pydantic schemas in `src/schemas.py`
3. Add database models in `src/models.py` if needed
4. Include router in `src/main.py`

### Database Schema Changes

This MVP uses `Base.metadata.create_all()` for automatic table creation. For production:
- Implement proper migration system (Alembic)
- Version control schema changes
- Test migrations on staging before production

## 📄 License

MIT License
