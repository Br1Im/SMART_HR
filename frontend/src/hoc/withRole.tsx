import React, { ComponentType } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface WithRoleProps {
  [key: string]: any;
}

/**
 * HOC для проверки ролей пользователя
 * @param allowedRoles - массив разрешенных ролей
 * @param fallbackComponent - компонент для отображения при отсутствии прав (опционально)
 */
export function withRole<P extends WithRoleProps>(
  allowedRoles: string[],
  fallbackComponent?: ComponentType<any>
) {
  return function (WrappedComponent: ComponentType<P>) {
    const WithRoleComponent: React.FC<P> = (props) => {
      const { user, isAuthenticated, isLoading } = useAuth();

      // Показываем загрузку пока проверяется аутентификация
      if (isLoading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        );
      }

      // Если пользователь не аутентифицирован
      if (!isAuthenticated || !user) {
        if (fallbackComponent) {
          const FallbackComponent = fallbackComponent;
          return <FallbackComponent {...props} />;
        }
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Доступ запрещен
              </h2>
              <p className="text-gray-600">
                Для доступа к этой странице необходимо войти в систему
              </p>
            </div>
          </div>
        );
      }

      // Проверяем роль пользователя
      const hasRequiredRole = allowedRoles.includes(user.role);

      if (!hasRequiredRole) {
        if (fallbackComponent) {
          const FallbackComponent = fallbackComponent;
          return <FallbackComponent {...props} />;
        }
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Недостаточно прав
              </h2>
              <p className="text-gray-600">
                У вас нет прав для доступа к этой странице
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Требуемые роли: {allowedRoles.join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                Ваша роль: {user.role}
              </p>
            </div>
          </div>
        );
      }

      // Если все проверки пройдены, отображаем компонент
      return <WrappedComponent {...props} />;
    };

    // Устанавливаем displayName для лучшей отладки
    WithRoleComponent.displayName = `withRole(${WrappedComponent.displayName || WrappedComponent.name})`;

    return WithRoleComponent;
  };
}

// Экспортируем также типы для удобства использования
export type Role = 'ADMIN' | 'CURATOR' | 'CLIENT' | 'CANDIDATE';

// Предустановленные роли для удобства
export const ROLES: Record<Role, Role> = {
  ADMIN: 'ADMIN',
  CURATOR: 'CURATOR',
  CLIENT: 'CLIENT',
  CANDIDATE: 'CANDIDATE',
};

// Примеры использования:
// export default withRole(['ADMIN'])(AdminDashboard);
// export default withRole(['ADMIN', 'CURATOR'])(CrmPage);
// export default withRole(['CLIENT'], UnauthorizedComponent)(ClientPage);