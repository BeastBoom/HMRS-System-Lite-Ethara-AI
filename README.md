# HRMS-Lite 🚀

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=23C55E&width=435&lines=Modern+HR+Management;Full-Stack+Solution;React+%2B+FastAPI;Real-time+Analytics)

> A lightweight, modern Human Resource Management System for managing employees, departments, and attendance.

<div align="center">

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://hmrs-system-lite-ethara-ai.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://hmrs-system-lite-ethara-ai.onrender.com/docs)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[**🌐 Live Frontend**](https://hmrs-system-lite-ethara-ai.vercel.app/) | [**📚 API Documentation**](https://hmrs-system-lite-ethara-ai.onrender.com/docs)

</div>

---

### ⚠️ Important Note: Database Cold Start
The backend is hosted on **Render's Free Tier**. If you see a "Network Error" or infinite loading on the frontend, please **wait 60-90 seconds** for the server to wake up.

---


## 📋 Table of Contents
- [✨ Features](#-features)
- [🏗️ Workflow](#-workflow)
- [🛠️ Tech Stack](#-tech-stack)
- [� Installation](#-installation)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## ✨ Features

## 🚀 Quick Start (Local)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### 1. Clone & Database
```bash
git clone https://github.com/BeastBoom/HMRS-System-Lite-Ethara-AI.git
cd hrms-lite
# Ensure you have a PostgreSQL database running locally
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# Activate: .venv\Scripts\activate (Win) or source .venv/bin/activate (Mac/Linux)
pip install -r requirements.txt

# Create .env file with:
# DATABASE_URL=postgresql://user:pass@localhost:5432/hrms_db
# ALLOWED_ORIGINS=http://localhost:5173

uvicorn src.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create .env file with:
# VITE_API_URL=http://localhost:8000
npm run dev
```

Visit `http://localhost:5173` to view the app!



## 📁 Project Structure

```bash
hrms-lite/
├── backend/            # FastAPI Server
│   ├── src/
│   │   ├── routers/    # API Endpoints (Employees, Attendance, Dashboard)
│   │   ├── models.py   # Database Schemas
│   │   └── main.py     # App Entry Point
├── frontend/           # React Client
│   ├── src/
│   │   ├── pages/      # Application Pages
│   │   ├── components/ # Reusable UI Components
│   │   └── services/   # API Integration
└── README.md           # Documentation
```

