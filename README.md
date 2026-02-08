# HRMS-Lite 🚀

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=23C55E&width=435&lines=Modern+HR+Management;Full-Stack+Solution;React+%2B+FastAPI;Real-time+Analytics)

> **HRMS-Lite** is a lightweight, modern Human Resource Management System designed to streamline employee management and attendance tracking. Built with a robust **FastAPI** backend and a responsive **React** frontend, it offers a seamless experience for HR administrators.

<div align="center">

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://hmrs-system-lite-ethara-ai.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://hmrs-system-lite-ethara-ai.onrender.com/docs)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[**🌐 Live Frontend Demo**](https://hmrs-system-lite-ethara-ai.vercel.app/) | [**📚 API Backend Docs**](https://hmrs-system-lite-ethara-ai.onrender.com/docs)

</div>

---

### ⚠️ Important: Database Cold Start
The backend is hosted on **Render's Free Tier**, which spins down after 15 minutes of inactivity.
> **If you experience a "Network Error" or infinite loading on the frontend, please wait 60-90 seconds for the server to wake up.**
> Once active, the application will respond instantly.

---

## 📋 Table of Contents

1. [✨ Project Overview](#-project-overview)
2. [🚀 Key Features](#-key-features)
3. [🛠️ Tech Stack](#-tech-stack)
4. [🏗️ Workflow](#-workflow)
5. [📦 Installation & Setup](#-installation--setup)
6. [🌐 Deployment](#-deployment)
7. [📁 Project Structure](#-project-structure)
8. [🤝 Contributing](#-contributing)

## ✨ Project Overview

HRMS-Lite solves the problem of complex and clunky HR software by providing a focused, fast, and user-friendly interface for essential tasks. It separates concerns between a highly performant API and a dynamic client-side application.

### What it does:
- **Centralizes Employee Data**: Keep all employee records in one secure database.
- **Simplifies Attendance**: Easy daily check-ins and bulk attendance marking.
- **Visualizes Insights**: Instant dashboard metrics for better decision-making.

## 🚀 Key Features

*   **👥 Employee Management**:
    *   Add new employees with dynamic department selection.
    *   View, update, and delete employee records.
    *   Search and filter by name, ID, or department.
*   **📅 Attendance Tracking**:
    *   Mark attendance (Present/Absent) for individual employees.
    *   **Bulk Action**: Mark attendance for multiple employees simultaneously.
    *   View historical attendance logs.
*   **📊 Analytics Dashboard**:
    *   Real-time overview of Total Employees, Present Today, and Attendance %.
    *   Visual charts for Attendance Trends (Last 30 Days) and Department Distribution.
*   **📱 Modern UI/UX**:
    *   Fully responsive design (Desktop, Tablet, Mobile).
    *   Loading skeletons, toast notifications, and smooth transitions.

## 🛠️ Tech Stack

### Frontend (Client)
*   **Framework**: [React 18](https://react.dev/) (via Vite)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/)
*   **State/API**: Axios, React Hooks
*   **Visualization**: Recharts
*   **Icons**: Lucide React

### Backend (Server)
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
*   **Validation**: [Pydantic](https://docs.pydantic.dev/)
*   **Server**: Uvicorn

## 🏗️ Workflow

1.  **Dashboard**: Start here for a quick snapshot of the organization's health.
2.  **Employees Page**: The central hub for team management. Use the **"Add Employee"** button to onboard staff.
3.  **Attendance Page**: Daily task area. Toggle between "Single" and "Bulk" modes to mark attendance efficiently.
4.  **Update Page**: Dedicated route for modifying sensitive employee data or correcting past attendance records.

## 📦 Installation & Setup

### Prerequisites
*   Node.js 18+
*   Python 3.10+
*   PostgreSQL (Local or Cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/BeastBoom/HMRS-System-Lite-Ethara-AI.git
cd hrms-lite
```

### 2. Backend Setup
Navigate to the `backend` folder and follow these steps:
```bash
cd backend
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/hrms_db" > .env
echo "ALLOWED_ORIGINS=http://localhost:5173" >> .env

# Run server
uvicorn src.main:app --reload
```
*detailed instructions in [backend/README.md](./backend/README.md)*

### 3. Frontend Setup
Navigate to the `frontend` folder:
```bash
cd ../frontend
# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Run dev server
npm run dev
```
*detailed instructions in [frontend/README.md](./frontend/README.md)*

## 🌐 Deployment

The project is live and production-ready!

| Service | Provider | URL |
|---------|----------|-----|
| **Frontend** | Vercel | [https://hmrs-system-lite-ethara-ai.vercel.app](https://hmrs-system-lite-ethara-ai.vercel.app/) |
| **Backend** | Render | [https://hmrs-system-lite-ethara-ai.onrender.com](https://hmrs-system-lite-ethara-ai.onrender.com) |
| **Docs** | SwaggerUI | [https://hmrs-system-lite-ethara-ai.onrender.com/docs](https://hmrs-system-lite-ethara-ai.onrender.com/docs) |

## 📁 Project Structure

```bash
hrms-lite/
├── backend/            # Python/FastAPI Backend
│   ├── src/
│   │   ├── routers/    # API Route Definitions
│   │   ├── models.py   # Database Models
│   │   └── main.py     # Application Entry Point
│   └── requirements.txt
├── frontend/           # React/TypeScript Frontend
│   ├── src/
│   │   ├── pages/      # Application Views (Dashboard, Employees, etc.)
│   │   ├── components/ # Reusable UI Components
│   │   └── services/   # API Client
│   └── package.json
└── README.md           # Project Documentation
```

## 🤝 Contributing

Contributions are welcome!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
**Built with ❤️ using React & FastAPI**
