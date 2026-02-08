# HRMS-Lite Backend

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=23C55E&width=435&lines=FastAPI+Backend;RESTful+Architecture;Auto-scaling+Database;Secure+&+Reliable)

> The robust server-side application for HRMS Lite, built with **FastAPI**, **PostgreSQL**, and **SQLAlchemy**.

<div align="center">

[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://hmrs-system-lite-ethara-ai.onrender.com/docs)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

[**📚 Interactive API Docs**](https://hmrs-system-lite-ethara-ai.onrender.com/docs) | [**🔴 ReDoc**](https://hmrs-system-lite-ethara-ai.onrender.com/redoc)

</div>

---

### ⚠️ Important Note: Cold Start
The backend is hosted on **Render's Free Tier**. It spins down after inactivity. Initial requests may take **60-90 seconds** to process while the server wakes up.

---

![Line Separator](https://i.imgur.com/WAae9OT.gif)

## 📋 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Local Development](#-local-development)
- [📡 API Endpoints](#-api-endpoints)
- [🗄️ Database Schema](#-database-schema)
- [📁 Folder Structure](#-folder-structure)

## ✨ Features

- **🚀 High Performance**: Built on Starlette and Pydantic for speed.
- **🛡️ Auto-Documentation**: Swagger UI & ReDoc generated automatically.
- **💾 Database ORM**: SQLAlchemy for robust database management.
- **🔄 CORS Enabled**: Configured for seamless frontend integration.
- **✨ Auto-Migrations**: Tables created automatically on startup.
- **✅ Data Validation**: Rigorous request validation with Pydantic.

![Line Separator](https://i.imgur.com/WAae9OT.gif)

## 🛠️ Tech Stack

| Category | Technology | usage |
|----------|------------|-------|
| **Framework** | FastAPI | Web Framework |
| **Language** | Python 3.10+ | Core Logic |
| **Database** | PostgreSQL | Data Persistence |
| **ORM** | SQLAlchemy | Database Interaction |
| **Validation** | Pydantic | Data Schema & Validation |
| **Server** | Uvicorn | ASGI Server |

![Line Separator](https://i.imgur.com/WAae9OT.gif)

## 🚀 Local Development

### Prerequisites
- Python 3.10+
- PostgreSQL Database

### 1. Environment Setup
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate
```

### 2. Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configuration
Create a `.env` file:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/hrms_db
ALLOWED_ORIGINS=http://localhost:5173,https://hmrs-system-lite-ethara-ai.vercel.app
```
> **Note**: Add your Vercel frontend URL to `ALLOWED_ORIGINS` for production.

### 4. Run Server
```bash
uvicorn src.main:app --reload
```
Server running at `http://localhost:8000`.

![Line Separator](https://i.imgur.com/WAae9OT.gif)

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | System Health Check |
| `GET` | `/api/employees` | List all employees |
| `POST` | `/api/employees` | Add new employee |
| `GET` | `/api/attendance` | Check attendance status |
| `POST` | `/api/attendance` | Mark attendance |
| `GET` | `/api/dashboard/*` | Analytics data |

> **Note**: Full list available at `/docs`.

## 🗄️ Database Schema

### Employees table
- `id` (UUID, PK)
- `full_name` (String)
- `email` (String, Unique)
- `department_id` (FK)

### Attendance Table
- `id` (UUID, PK)
- `employee_id` (FK)
- `date` (Date)
- `status` (Enum: Present/Absent)

## 📁 Folder Structure

```bash
backend/src/
├── routers/       # API Route Handlers
├── models.py      # SQLAlchemy Models
├── schemas.py     # Pydantic Schemas
├── database.py    # DB Connection
└── main.py        # App Config
```

---
**Built with ❤️ using FastAPI & Python**
