import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

export interface Permission {
  resource: string;
  action: string;
}

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasPermission = this.checkPermissions(user.role, requiredPermissions);
    
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  private checkPermissions(userRole: string, requiredPermissions: Permission[]): boolean {
    // Define role-based permissions
    const rolePermissions = {
      ADMIN: [
        { resource: 'courses', action: 'read' },
        { resource: 'courses', action: 'create' },
        { resource: 'courses', action: 'update' },
        { resource: 'courses', action: 'delete' },
        { resource: 'lessons', action: 'read' },
        { resource: 'lessons', action: 'create' },
        { resource: 'lessons', action: 'update' },
        { resource: 'lessons', action: 'delete' },
      ],
      CURATOR: [
        { resource: 'courses', action: 'read' },
        { resource: 'courses', action: 'create' },
        { resource: 'courses', action: 'update' },
        { resource: 'lessons', action: 'read' },
        { resource: 'lessons', action: 'create' },
        { resource: 'lessons', action: 'update' },
      ],
      CLIENT: [
        { resource: 'courses', action: 'read' },
        { resource: 'lessons', action: 'read' },
      ],
      CANDIDATE: [
        { resource: 'courses', action: 'read' },
        { resource: 'lessons', action: 'read' },
      ],
    };

    const userPermissions = rolePermissions[userRole] || [];

    return requiredPermissions.every(required =>
      userPermissions.some(permission =>
        permission.resource === required.resource && permission.action === required.action
      )
    );
  }
}