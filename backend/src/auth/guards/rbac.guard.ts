import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacService } from '../rbac.service';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacService: RbacService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredResource = this.reflector.getAllAndOverride<string>('resource', [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredAction = this.reflector.getAllAndOverride<string>('action', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredResource) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Пользователь не авторизован');
    }

    // Проверка ролей
    if (requiredRoles && !this.rbacService.hasRole(user.role, requiredRoles)) {
      throw new ForbiddenException('Недостаточно прав для выполнения операции');
    }

    // Проверка доступа к ресурсу
    if (requiredResource && requiredAction) {
      if (!this.rbacService.canAccess(user.role, requiredResource, requiredAction)) {
        throw new ForbiddenException('Недостаточно прав для доступа к ресурсу');
      }
    }

    return true;
  }
}