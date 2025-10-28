import { Injectable } from '@nestjs/common';

interface Permission {
  resource: string;
  actions: string[];
}

@Injectable()
export class RbacService {
  private readonly permissions: Record<string, Permission[]> = {
    'ADMIN': [
      { resource: '*', actions: ['*'] }, // Админ имеет доступ ко всему
    ],
    'CURATOR': [
      { resource: 'courses', actions: ['read', 'create', 'update', 'delete'] },
      { resource: 'lessons', actions: ['read', 'create', 'update', 'delete'] },
      { resource: 'quizzes', actions: ['read', 'create', 'update', 'delete'] },
      { resource: 'students', actions: ['read'] },
      { resource: 'progress', actions: ['read'] },
      { resource: 'audit', actions: ['read'] },
    ],
    'CLIENT': [
      { resource: 'courses', actions: ['read'] },
      { resource: 'lessons', actions: ['read'] },
      { resource: 'quizzes', actions: ['read'] },
      { resource: 'progress', actions: ['read', 'update'] }, // Свой прогресс
      { resource: 'profile', actions: ['read', 'update'] },
    ],
    'CANDIDATE': [
      { resource: 'courses', actions: ['read'] },
      { resource: 'lessons', actions: ['read'] },
      { resource: 'quizzes', actions: ['read'] },
      { resource: 'progress', actions: ['read', 'update'] }, // Свой прогресс
      { resource: 'profile', actions: ['read', 'update'] },
      { resource: 'applications', actions: ['read', 'create'] },
    ],
  };

  canAccess(userRole: string, resource: string, action: string): boolean {
    const rolePermissions = this.permissions[userRole];
    
    if (!rolePermissions) {
      return false;
    }

    // Проверяем права админа (доступ ко всему)
    if (userRole === 'ADMIN') {
      return true;
    }

    // Проверяем конкретные права
    return rolePermissions.some(permission => {
      const resourceMatch = permission.resource === '*' || permission.resource === resource;
      const actionMatch = permission.actions.includes('*') || permission.actions.includes(action);
      return resourceMatch && actionMatch;
    });
  }

  getPermissions(userRole: string): Permission[] {
    return this.permissions[userRole] || [];
  }

  hasRole(userRole: string, requiredRoles: string[]): boolean {
    return requiredRoles.includes(userRole);
  }

  // Проверка доступа к ресурсу с учетом владения
  canAccessResource(userRole: string, resource: string, action: string, ownerId?: string, userId?: string): boolean {
    // Базовая проверка прав
    if (!this.canAccess(userRole, resource, action)) {
      return false;
    }

    // Для клиентов проверяем владение ресурсом
    if (userRole === 'CLIENT' && ownerId && userId) {
      return ownerId === userId;
    }

    return true;
  }
}