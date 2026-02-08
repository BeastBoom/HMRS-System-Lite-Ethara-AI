# HRMS-Lite Frontend

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=23C55E&width=435&lines=Modern+React+Frontend;Responsive+Design;Real-time+Validation;Interactive+Charts)

> The user interface for HRMS Lite, built with **React**, **TypeScript**, and **TailwindCSS**.

<div align="center">

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://hmrs-system-lite-ethara-ai.vercel.app/)
[![Tech](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Style](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

[**🌐 Live Demo**](https://hmrs-system-lite-ethara-ai.vercel.app/)

</div>

---

### ⚠️ Important Note: Cold Start
The backend (Render) may sleep after inactivity. If the frontend shows a "Network Error" or spins indefinitely on first load, please wait **60-90 seconds** for the backend to wake up.

---


## 📋 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Local Development](#-local-development)
- [🏗️ Build & Scripts](#-build--scripts)
- [📁 Folder Structure](#-folder-structure)

## ✨ Features

- **🎨 Modern UI**: Clean, professional aesthetics with glassmorphism touches.
- **📱 Fully Responsive**: Optimized layout for Mobile, Tablet, and Desktop.
- **⚡ Fast & Interactive**: Powered by Vite for instant updates.
- **📊 Data Visualization**: Beautiful charts using Recharts.
- **🛡️ Type Safety**: Comprehensive TypeScript definitions.
- **🔔 Notifications**: Toast notifications for user feedback.



## 🛠️ Tech Stack

| Category | Technology | Usage |
|----------|------------|-------|
| **Core** | React 18 | UI Library |
| **Language** | TypeScript | Type validity |
| **Build** | Vite | Bundler & Dev Server |
| **Styling** | TailwindCSS | Utility-first CSS |
| **Routing** | React Router v6 | Client-side routing |
| **HTTP** | Axios | API Requests |
| **Icons** | Lucide React | Modern SVG Icons |
| **Charts** | Recharts | Dashboard Analytics |



## 🚀 Local Development

### Prerequisites
- Node.js 18+
- Backend running on `http://localhost:8000`

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Configuration
Create a `.env` file in the `frontend` root:
```env
VITE_API_URL=http://localhost:8000
```
> **Note**: For production, point this to your Render backend URL: `https://hmrs-system-lite-ethara-ai.onrender.com`

### 3. Start Server
```bash
npm run dev
```
Access the app at `http://localhost:5173`.



## 🏗️ Build & Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (`dist/` folder) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint validation |

## 📁 Folder Structure

```bash
frontend/src/
├── components/     # UI Building Blocks
│   ├── ui/         # Generic (Button, Card, Input)
│   └── layout/     # Structural (Header, Container)
├── pages/          # Route Views
│   ├── Dashboard   # Analytics & Overview
│   ├── Employees   # List & Management
│   └── Attendance  # Tracking Interface
├── services/       # API Integration (Axios)
└── types/          # TypeScript Interfaces
```

---
**Built with ❤️ using React & TailwindCSS**
