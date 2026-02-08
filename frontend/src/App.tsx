import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/Toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import EmployeeDetails from './pages/EmployeeDetails';
import UpdatePage from './pages/UpdatePage';

import { useState, useEffect } from 'react';
import Preloader from './components/ui/Preloader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app load (e.g., checking auth, fetching user settings)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading && <Preloader />}
      <Toaster />
      {!loading && (
        <Layout>
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetails />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/update" element={<UpdatePage />} />
            </Routes>
        </Layout>
      )}
    </Router>
  );
}

export default App;
