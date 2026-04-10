import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardGuru from './pages/DashboardGuru';
import DashboardSiswa from './pages/DashboardSiswa';

// Protected Route components
const ProtectedRoute = ({ children, allowedRole }) => {
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    return <Navigate to="/" replace />;
  }
  
  const user = JSON.parse(userData);
  
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'guru') {
      return <Navigate to="/guru" replace />;
    } else {
      return <Navigate to="/siswa" replace />;
    }
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/guru"
          element={
            <ProtectedRoute allowedRole="guru">
              <DashboardGuru />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siswa"
          element={
            <ProtectedRoute allowedRole="siswa">
              <DashboardSiswa />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
