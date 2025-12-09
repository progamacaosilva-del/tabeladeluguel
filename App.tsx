
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { PropertyForm } from './components/PropertyForm';
import { Login } from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

// Guard component to protect routes
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a loading spinner
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } 
      />
      <Route 
        path="/novo" 
        element={
          <RequireAuth>
            <PropertyForm />
          </RequireAuth>
        } 
      />
      <Route 
        path="/editar/:id" 
        element={
          <RequireAuth>
            <PropertyForm />
          </RequireAuth>
        } 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <div className="min-h-screen font-sans text-gray-900">
          <AppRoutes />
        </div>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
