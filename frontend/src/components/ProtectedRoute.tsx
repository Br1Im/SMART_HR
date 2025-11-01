import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Показываем загрузку пока проверяется аутентификация
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>Загрузка...</div>
      </div>
    );
  }

  // Если требуется авторизация, но пользователь не авторизован
  if (requireAuth && !isAuthenticated) {
    console.log('User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // Если указаны разрешённые роли и пользователь не имеет нужной роли
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>
          Доступ запрещён
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          У вас недостаточно прав для доступа к этой странице.
        </p>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Ваша роль: <strong>{user.role}</strong>
        </p>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Требуемые роли: <strong>{allowedRoles.join(', ')}</strong>
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Назад
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

// Хук для проверки ролей в компонентах
export const useRoleCheck = () => {
  const { user } = useAuth();

  const hasRole = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const isAdmin = (): boolean => hasRole(['ADMIN']);
  const isCurator = (): boolean => hasRole(['CURATOR']);
  const isClient = (): boolean => hasRole(['CLIENT']);
  const isCandidate = (): boolean => hasRole(['CANDIDATE']);
  const isAdminOrCurator = (): boolean => hasRole(['ADMIN', 'CURATOR']);

  return {
    hasRole,
    isAdmin,
    isCurator,
    isClient,
    isCandidate,
    isAdminOrCurator,
    userRole: user?.role,
  };
};