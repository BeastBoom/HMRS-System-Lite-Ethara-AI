# HRMS-Lite Frontend

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=23C55E&width=435&lines=Modern+React+Frontend;Responsive+Design;Real-time+Validation;Interactive+Charts)

> The modern, responsive user interface for **HRMS-Lite**, built to provide a seamless experience for HR management.

<div align="center">

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://hmrs-system-lite-ethara-ai.vercel.app/)
[![Tech](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Style](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

[**🌐 Launch Live Demo**](https://hmrs-system-lite-ethara-ai.vercel.app/)

</div>

---

### ⚠️ Important: API Connection
The frontend connects to a backend hosted on **Render Free Tier**.
> **If charts are empty or data is missing on first load:**
> Please wait **60-90 seconds** for the backend to wake up. This is a limitation of the free hosting tier.

---

## 📋 Table of Contents

1. [✨ Features](#-features)
2. [🛠️ Technology Stack](#-technology-stack)
3. [🚀 Getting Started](#-getting-started)
4. [🏗️ Scripts](#-scripts)
5. [📁 Folder Structure](#-folder-structure)
6. [🔧 Troubleshooting](#-troubleshooting)

## ✨ Features

*   **🎨 Glassmorphic UI**: A clean, modern aesthetic using transparency and blur effects.
*   **📱 Responsive Layout**: Adapts perfectly to mobile phones, tablets, and large desktop screens.
*   **⚡ Real-Time Feedback**: Immediate validation for forms and toast notifications for actions.
*   **📊 Interactive Charts**: Visual data representation using `recharts` for attendance trends.
*   **🔍 Advanced Search**: Client-side filtering for employees and attendance records.
*   **🌗 Dynamic Components**: Reusable components for Modals, Cards, and Inputs.

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Core** | [React 18](https://react.dev/) | Component-based UI library |
| **Build Tool** | [Vite](https://vitejs.dev/) | Next-generation frontend tooling |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Static type definitions |
| **Styling** | [TailwindCSS](https://tailwindcss.com/) | Utility-first CSS framework |
| **Routing** | [React Router v6](https://reactrouter.com/) | Client-side routing |
| **HTTP Client** | [Axios](https://axios-http.com/) | Promise-based HTTP client |
| **Icons** | [Lucide React](https://lucide.dev/) | Beautiful & consistent icons |
| **Charts** | [Recharts](https://recharts.org/) | Composable charting library |

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### 1. Installation
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `frontend` root directory:

```env
# Local Development
VITE_API_URL=http://localhost:8000

# Production (Example)
# VITE_API_URL=https://hmrs-system-lite-ethara-ai.onrender.com
```

### 3. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🏗️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server with HMR. |
| `npm run build` | Builds the app for production to the `dist` folder. |
| `npm run preview` | Locally preview the production build. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

## 📁 Folder Structure

```bash
frontend/src/
├── components/         # Reusable UI components
│   ├── ui/             # Atomic components (Buttons, Cards, Inputs)
│   ├── layout/         # Structural components (Header, Page wrappers)
│   └── Employee/       # Employee-specific components
├── pages/              # Main route views
│   ├── Dashboard.tsx   # Analytics overview
│   ├── Employees.tsx   # Employee management
│   ├── Attendance.tsx  # Attendance tracking
│   └── UpdatePage.tsx  # Edit records
├── services/           # API integration services
│   └── api.ts          # Centralized Axios configuration
├── types/              # TypeScript interfaces and types
├── App.tsx             # Main application component
└── main.tsx            # Entry point
```

## 🔧 Troubleshooting

### "Network Error" or API Connection Failed
1.  Ensure the backend server is running (`http://localhost:8000`).
2.  Check your `.env` file matches the backend URL.
3.  If connecting to the live backend, wait for the cold start.

### CORS Errors
If you see CORS errors in the console, ensure the **Backend** has your frontend URL added to `ALLOWED_ORIGINS` in its `.env` file.

---
**Built with ❤️ using React & TailwindCSS**
