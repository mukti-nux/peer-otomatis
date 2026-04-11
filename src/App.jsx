import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardGuru from './pages/DashboardGuru';
import DashboardSiswa from './pages/DashboardSiswa';
import Manajemen from './pages/Manajemen';
import NotifikasiWA from './pages/NotifikasiWA';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdmin from './pages/SuperAdmin';

const ProtectedRoute = ({ children, allowedRole }) => {
  const session = localStorage.getItem('user_session');
  
  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  const user = JSON.parse(session);
  
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'guru') {
      return <Navigate to="/dashboard-guru" replace />;
    } else {
      return <Navigate to="/dashboard-siswa" replace />;
    }
  }
  
  return children;
};

// Protected Route for SuperAdmin
const SuperAdminProtectedRoute = ({ children }) => {
  const session = localStorage.getItem('superadmin_session');
  
  if (!session) {
    return <Navigate to="/super-admin/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
          path="/dashboard-guru"
          element={
            <ProtectedRoute allowedRole="guru">
              <DashboardGuru />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-siswa"
          element={
            <ProtectedRoute allowedRole="siswa">
              <DashboardSiswa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manajemen"
          element={
            <ProtectedRoute allowedRole="guru">
              <Manajemen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifikasi-wa"
          element={
            <ProtectedRoute allowedRole="guru">
              <NotifikasiWA />
            </ProtectedRoute>
          }
        />
        
        {/* SuperAdmin Routes */}
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route
          path="/super-admin"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdmin />
            </SuperAdminProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
