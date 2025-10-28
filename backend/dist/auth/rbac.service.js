"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
let RbacService = class RbacService {
    constructor() {
        this.permissions = {
            'ADMIN': [
                { resource: '*', actions: ['*'] },
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
                { resource: 'progress', actions: ['read', 'update'] },
                { resource: 'profile', actions: ['read', 'update'] },
            ],
            'CANDIDATE': [
                { resource: 'courses', actions: ['read'] },
                { resource: 'lessons', actions: ['read'] },
                { resource: 'quizzes', actions: ['read'] },
                { resource: 'progress', actions: ['read', 'update'] },
                { resource: 'profile', actions: ['read', 'update'] },
                { resource: 'applications', actions: ['read', 'create'] },
            ],
        };
    }
    canAccess(userRole, resource, action) {
        const rolePermissions = this.permissions[userRole];
        if (!rolePermissions) {
            return false;
        }
        if (userRole === 'ADMIN') {
            return true;
        }
        return rolePermissions.some(permission => {
            const resourceMatch = permission.resource === '*' || permission.resource === resource;
            const actionMatch = permission.actions.includes('*') || permission.actions.includes(action);
            return resourceMatch && actionMatch;
        });
    }
    getPermissions(userRole) {
        return this.permissions[userRole] || [];
    }
    hasRole(userRole, requiredRoles) {
        return requiredRoles.includes(userRole);
    }
    canAccessResource(userRole, resource, action, ownerId, userId) {
        if (!this.canAccess(userRole, resource, action)) {
            return false;
        }
        if (userRole === 'CLIENT' && ownerId && userId) {
            return ownerId === userId;
        }
        return true;
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = __decorate([
    (0, common_1.Injectable)()
], RbacService);
//# sourceMappingURL=rbac.service.js.map