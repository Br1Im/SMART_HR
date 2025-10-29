import React from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminNavigation } from './layout/AdminNavigation';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
}) => {
  return (
    <ProtectedRoute allowedRoles={allowedRoles} requireAuth={requireAuth}>
      <AdminNavigation />
      {children}
    </ProtectedRoute>
  );
};