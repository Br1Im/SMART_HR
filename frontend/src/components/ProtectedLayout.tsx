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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </ProtectedRoute>
  );
};