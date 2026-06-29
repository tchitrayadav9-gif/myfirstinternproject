import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';

// Public Pages
import Home from '../pages/Home';
import Services from '../pages/Services';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminEmployees from '../pages/admin/Employees';
import AdminTasks from '../pages/admin/Tasks';
import AdminSchedule from '../pages/admin/Schedule';
import AdminClients from '../pages/admin/Clients';
import AdminProjects from '../pages/admin/Projects';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminSupport from '../pages/admin/Support';
import AdminSettings from '../pages/admin/Settings';

// Employee Pages
import EmployeeDashboard from '../pages/employee/Dashboard';
import EmployeeTasks from '../pages/employee/MyTasks';
import EmployeeSchedule from '../pages/employee/MySchedule';
import EmployeeProjects from '../pages/employee/MyProjects';
import EmployeeProfile from '../pages/employee/Profile';
import EmployeeSupport from '../pages/employee/Support';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  const userRoleLower = user?.role?.toLowerCase();
  const allowedRoleLower = allowedRole?.toLowerCase();
  
  if (allowedRole && userRoleLower !== allowedRoleLower) {
    return userRoleLower === 'admin' 
      ? <Navigate to="/dashboard" replace /> 
      : <Navigate to="/employee-dashboard" replace />;
  }

  return children;
};

// Public Route
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    if (!user) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      );
    }
    return user?.role?.toLowerCase() === 'admin' 
      ? <Navigate to="/dashboard" replace /> 
      : <Navigate to="/employee-dashboard" replace />;
  }

  return children;
};

// Role-based Layout Wrapper
const RoleLayoutWrapper = () => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  const userRoleLower = user?.role?.toLowerCase();
  
  if (userRoleLower === 'admin') {
    return <AdminLayout />;
  } else if (userRoleLower === 'employee') {
    return <EmployeeLayout />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

// Shared Support Page Wrapper
const SupportWrapper = () => {
  const { user } = useAuth();
  if (user?.role?.toLowerCase() === 'admin') {
    return <AdminSupport />;
  }
  return <EmployeeSupport />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Site Routes wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Login & Signup Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } 
      />
      <Route 
        path="/reset-password/:token" 
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } 
      />

      {/* Protected Layout Routes */}
      <Route element={<RoleLayoutWrapper />}>
        {/* Admin Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employees" 
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminEmployees />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminTasks />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/schedule" 
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminSchedule />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clients" 
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminClients />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminProjects />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminSettings />
            </ProtectedRoute>
          } 
        />

        {/* Employee Dashboard Routes */}
        <Route 
          path="/employee-dashboard" 
          element={
            <ProtectedRoute allowedRole="Employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-tasks" 
          element={
            <ProtectedRoute allowedRole="Employee">
              <EmployeeTasks />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-schedule" 
          element={
            <ProtectedRoute allowedRole="Employee">
              <EmployeeSchedule />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-projects" 
          element={
            <ProtectedRoute allowedRole="Employee">
              <EmployeeProjects />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRole="Employee">
              <EmployeeProfile />
            </ProtectedRoute>
          } 
        />

        {/* Shared Support Route */}
        <Route path="/support" element={<SupportWrapper />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
