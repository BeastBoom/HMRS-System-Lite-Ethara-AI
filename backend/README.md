# HRMS-Lite Backend

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=23C55E&width=435&lines=FastAPI+Backend;RESTful+Architecture;Auto-scaling+Database;Secure+&+Reliable)

> The robust, high-performance server-side application for **HRMS-Lite**, providing the RESTful API that powers the system.

<div align="center">

[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://hmrs-system-lite-ethara-ai.onrender.com/docs)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

[**📚 Interactive API Docs (Swagger)**](https://hmrs-system-lite-ethara-ai.onrender.com/docs) | [**🔴 ReDoc**](https://hmrs-system-lite-ethara-ai.onrender.com/redoc)

</div>

---

### ⚠️ Important: Free Tier Hosting
The backend is hosted on **Render's Free Tier**.
> **Cold Start**: The server sleeps after inactivity. Initial requests may take **60-90 seconds** to process. Please be patient.

---

## 📋 Table of Contents

1. [✨ Features](#-features)
2. [🛠️ Technology Stack](#-technology-stack)
3. [🚀 Getting Started](#-getting-started)
4. [📡 API Endpoints](#-api-endpoints)
5. [🗄️ Database Schema](#-database-schema)
6. [� Configuration & Troubleshooting](#-configuration--troubleshooting)

## ✨ Features

*   **High Performance**: Built on **FastAPI**, one of the fastest Python frameworks available.
*   **Auto-Documentation**: Automatically generates interactive API docs (Swagger UI) at `/docs`.
*   **Data Validation**: Uses **Pydantic** models to ensure data integrity and provide clear error messages.
*   **ORM Integration**: Uses **SQLAlchemy** for efficient and secure database interactions.
*   **Auto-Migrations**: Automatically creates necessary database tables on startup.
*   **CORS Support**: Configurable Cross-Origin Resource Sharing for secure frontend communication.

## 🛠️ Technology Stack

| Category | Technology | Usage |
|----------|------------|-------|
| **Framework** | [FastAPI](https://fastapi.tiangolo.com/) | API Framework |
| **Language** | Python 3.10+ | Core Logic |
| **Server** | [Uvicorn](https://www.uvicorn.org/) | ASGI Web Server |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Data Storage |
| **ORM** | [SQLAlchemy](https://www.sqlalchemy.org/) | Object-Relational Mapping |
| **Validation** | [Pydantic](https://docs.pydantic.dev/) | Data Serialization & Schema |

## 🚀 Getting Started

### Prerequisites
*   Python 3.10 or higher
*   PostgreSQL installed and running

### 1. Environment Setup
Navigate to the backend directory and set up a virtual environment:

```bash
cd backend
python -m venv .venv

# Activate Virtual Environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the `backend` directory:

```env
# Database Connection String
DATABASE_URL=postgresql://user:password@localhost:5432/hrms_db

# Allowed Origins (Comma separated)
ALLOWED_ORIGINS=http://localhost:5173,https://your-production-url.app
```

### 4. Run the Server
```bash
# Development (Auto-reload)
uvicorn src.main:app --reload

# Production
uvicorn src.main:app --host 0.0.0.0 --port 8000
```
Server will start at `http://localhost:8000`.

## 📡 API Endpoints

Here is a summary of the available endpoints. Visit `/docs` for full details.

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/health` | Health Check (Returns {"status": "ok"}) |
| **GET** | `/api/employees` | List all employees (Pagination, Search, Filter) |
| **POST** | `/api/employees` | Create a new employee |
| **GET** | `/api/employees/{id}` | Get specific employee details |
| **GET** | `/api/attendance` | Check attendance status |
| **POST** | `/api/attendance` | Mark attendance (Single) |
| **POST** | `/api/attendance/bulk` | Mark attendance (Bulk) |
| **GET** | `/api/dashboard/summary` | Get key metrics for dashboard |
| **GET** | `/api/dashboard/trends` | Get attendance trends for charts |

## 🗄️ Database Schema

### Employees (`employees`)
*   `id` (UUID, PK): Unique identifier.
*   `employee_id` (String, Unique): Custom ID (e.g., E-101).
*   `full_name` (String): Name of the employee.
*   `email` (String, Unique): Contact email.
*   `department` (String): Department name.

### Attendance (`attendance`)
*   `id` (UUID, PK): Unique identifier.
*   `employee_id` (UUID, FK): Link to Employee.
*   `date` (Date): The date of attendance.
*   `status` (Enum): `present` or `absent`.

## � Configuration & Troubleshooting

### Database Connection Failed
- Ensure PostgreSQL is running.
- Verify your `DATABASE_URL` credentials (username, password, db name).
- If using a cloud DB (Supabase/Neon), ensure your IP is whitelisted if required.

### CORS Errors
- Update `ALLOWED_ORIGINS` in your `.env` file to include the URL of your frontend application (e.g., `http://localhost:5173`).

---
**Built with ❤️ using FastAPI & Python**
