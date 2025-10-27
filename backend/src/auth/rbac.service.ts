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
    'MANAGER': [
      { resource: 'crm', actions: ['read', 'create', 'update', 'delete'] },
      { resource: 'organizations', actions: ['read', 'create', 'update', 'delete'] },
      { resource: 'contacts', actions: ['read', 'create', 'update', 'delete'] },
      { resource: 'vacancies', actions: ['read', 'create', 'update', 'delete'] },
      { resource: 'candidates', actions: ['read', 'create', 'update', 'delete'] },
      { resource: 'audit', actions: ['read'] },
    ],
    'CLIENT': [
      { resource: 'organizations', actions: ['read', 'update'] }, // Только свои
      { resource: 'contacts', actions: ['read', 'create', 'update', 'delete'] }, // Только свои
      { resource: 'vacancies', actions: ['read', 'create', 'update', 'delete'] }, // Только свои
      { resource: 'candidates', actions: ['read'] }, // Только для своих вакансий
    ],
    'CANDIDATE': [
      { resource: 'courses', actions: ['read'] },
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