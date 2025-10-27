import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacService } from '../rbac.service';
export declare class RbacGuard implements CanActivate {
    private reflector;
    private rbacService;
    constructor(reflector: Reflector, rbacService: RbacService);
    canActivate(context: ExecutionContext): boolean;
}
