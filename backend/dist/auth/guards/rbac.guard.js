"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rbac_service_1 = require("../rbac.service");
let RbacGuard = class RbacGuard {
    constructor(reflector, rbacService) {
        this.reflector = reflector;
        this.rbacService = rbacService;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        const requiredResource = this.reflector.getAllAndOverride('resource', [
            context.getHandler(),
            context.getClass(),
        ]);
        const requiredAction = this.reflector.getAllAndOverride('action', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles && !requiredResource) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Пользователь не авторизован');
        }
        if (requiredRoles && !this.rbacService.hasRole(user.role, requiredRoles)) {
            throw new common_1.ForbiddenException('Недостаточно прав для выполнения операции');
        }
        if (requiredResource && requiredAction) {
            if (!this.rbacService.canAccess(user.role, requiredResource, requiredAction)) {
                throw new common_1.ForbiddenException('Недостаточно прав для доступа к ресурсу');
            }
        }
        return true;
    }
};
exports.RbacGuard = RbacGuard;
exports.RbacGuard = RbacGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        rbac_service_1.RbacService])
], RbacGuard);
//# sourceMappingURL=rbac.guard.js.map