import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardGuru from './pages/DashboardGuru';
import DashboardSiswa from './pages/DashboardSiswa';
import Manajemen from './pages/Manajemen';

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
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
