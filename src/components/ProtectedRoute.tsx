
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If admin required but user is not admin, redirect to home
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // User is authenticated (and is admin if required), render children
  return <>{children}</>;
};

export default ProtectedRoute;
