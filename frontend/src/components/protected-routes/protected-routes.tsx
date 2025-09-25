import { useAuthStore } from '@/stores/authStore';
import React from 'react';
import { Navigate } from 'react-router';

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to='/login' replace />;

  return children;
};

export default ProtectedRoutes;
