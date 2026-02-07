# HRMS-Lite Frontend

Modern, responsive React frontend for the Human Resource Management System. Built with TypeScript, Vite, and TailwindCSS.

## 🎯 Features

- **Modern UI**: Clean, professional interface with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Validation**: Instant feedback on form inputs
- **Interactive Charts**: Visual analytics with Recharts
- **Toast Notifications**: User-friendly success/error messages
- **Type Safety**: Full TypeScript support for better development experience
- **Fast Development**: Lightning-fast HMR with Vite

## 🛠️ Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   └── ui/             # UI components (Button, Card, etc.)
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Dashboard with analytics
│   │   ├── Employees.tsx   # Employee list & management
│   │   ├── EmployeeDetails.tsx  # Individual employee view
│   │   ├── Attendance.tsx  # Attendance marking
│   │   └── UpdatePage.tsx  # Employee update form
│   ├── services/           # API service layer
│   │   └── api.ts          # Axios API client
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Shared types
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles & Tailwind imports
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md              # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm, pnpm, or yarn package manager

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install with npm
npm install

# Or with pnpm (recommended)
pnpm install

# Or with yarn
yarn install
```

### 2. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

**For production:**
```env
VITE_API_URL=https://your-backend-api.onrender.com
```

### 3. Start Development Server

```bash
# With npm
npm run dev

# With pnpm
pnpm dev

# With yarn
yarn dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
# With npm
npm run build

# With pnpm
pnpm build

# With yarn
yarn build
```

Build output will be in the `dist/` directory.

### 5. Preview Production Build

```bash
# With npm
npm run preview

# With pnpm
pnpm preview

# With yarn
yarn preview
```

## 📱 Application Pages

### Dashboard (`/`)
- Overview of key metrics (total employees, attendance stats)
- Attendance trends chart (last 30 days)
- Department distribution chart
- Quick navigation to other sections

### Employees (`/employees`)
- Paginated employee list
- Search by name, email, or employee ID
- Filter by department
- Sort by various fields
- Add new employee
- Delete employees
- Navigate to employee details

### Employee Details (`/employees/:id`)
- View employee information
- Edit employee details
- View attendance history
- Filter attendance by date range
- Mark attendance directly from employee page

### Attendance (`/attendance`)
- Mark attendance for employees
- Bulk attendance marking
- Date selection
- Status selection (Present/Absent)
- Real-time validation

### Update Employee (`/employees/:id/update`)
- Edit employee information
- Form validation
- Success/error notifications

## 🎨 UI Components

### Layout Components
- **Header**: Navigation bar with app title and menu
- **Sidebar**: Side navigation (if implemented)
- **PageTransition**: Smooth page transitions

### UI Components
- **MetricCard**: Dashboard metric display cards
- **ChartCard**: Container for charts with titles
- **Button**: Reusable button component
- **Input**: Form input with validation
- **Select**: Dropdown select component
- **Modal**: Dialog/modal component
- **Toast**: Notification system

## 🔌 API Integration

The frontend communicates with the backend via the API service layer (`src/services/api.ts`).

### API Client Configuration

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Available API Services

- `employeesApi`: Employee CRUD operations
- `attendanceApi`: Attendance tracking
- `dashboardApi`: Dashboard analytics
- `departmentsApi`: Department management

### Example Usage

```typescript
import { employeesApi } from './services/api';

// Fetch employees
const employees = await employeesApi.getAll({ page: 1, limit: 10 });

// Create employee
const newEmployee = await employeesApi.create({
  employeeId: 'E1001',
  fullName: 'John Doe',
  email: 'john@example.com',
  department: 'IT'
});
```

## 🎨 Styling

### TailwindCSS

The project uses TailwindCSS for styling. Custom theme configuration in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      brand: { /* custom brand colors */ },
      accent: { /* accent colors */ },
      sand: { /* sand colors */ }
    }
  }
}
```

### Custom Styles

Global styles and Tailwind directives are in `src/index.css`.

## 🔧 Troubleshooting

### Development Server Issues

**Error: "Cannot find module"**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf .vite`

**Port already in use**
- Change port in `vite.config.ts` or kill process using port 5173

### API Connection Issues

**API calls fail with CORS error**
- Verify backend has frontend URL in `ALLOWED_ORIGINS`
- Check `VITE_API_URL` in `.env` is correct
- Ensure backend is running

**API calls return 404**
- Verify `VITE_API_URL` points to correct backend
- Check backend API endpoints are accessible
- Open browser DevTools Network tab for details

### Build Issues

**Build fails with TypeScript errors**
- Run `npm run type-check` to see all errors
- Fix type errors before building
- Check `tsconfig.json` configuration

**Build succeeds but app doesn't work**
- Verify environment variables are set for production
- Check browser console for errors
- Ensure API URL is accessible from production environment

### Environment Variables Not Working

**Changes to `.env` not reflected**
- Restart development server after changing `.env`
- Environment variables must start with `VITE_`
- Access via `import.meta.env.VITE_VARIABLE_NAME`

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variable:
   - `VITE_API_URL`: Your backend API URL
7. Deploy!

### Netlify

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variable:
   - `VITE_API_URL`: Your backend API URL
6. Deploy!

### Static Hosting (Any Provider)

```bash
# Build the project
npm run build

# Upload contents of dist/ folder to your hosting provider
# Examples: AWS S3, GitHub Pages, Cloudflare Pages, etc.
```

## 🧪 Testing (Future Implementation)

For production, implement:

### Unit Tests
```bash
# Using Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### E2E Tests
```bash
# Using Playwright
npm install -D @playwright/test
```

## 📝 Development Guidelines

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in Header/Sidebar
4. Define types in `src/types/index.ts`

### Adding New API Endpoints

1. Add function to appropriate service in `src/services/api.ts`
2. Define TypeScript types in `src/types/index.ts`
3. Handle errors with try-catch and toast notifications

### Code Style

- Use TypeScript for type safety
- Follow React hooks best practices
- Use functional components
- Implement proper error handling
- Add loading states for async operations
- Use toast notifications for user feedback

## 🔐 Security Notes

- Never commit `.env` file to version control
- Use environment variables for sensitive data
- Implement proper authentication before production
- Sanitize user inputs
- Use HTTPS in production

## 📄 License

MIT License

---

**Built with ⚛️ React and ⚡ Vite**
