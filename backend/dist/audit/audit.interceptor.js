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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const audit_service_1 = require("./audit.service");
const audit_action_enum_1 = require("./audit-action.enum");
let AuditInterceptor = class AuditInterceptor {
    constructor(auditService, reflector) {
        this.auditService = auditService;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return next.handle();
        }
        const entity = this.reflector.get('resource', context.getHandler());
        const action = this.reflector.get('action', context.getHandler());
        if (!entity || !action) {
            return next.handle();
        }
        const httpMethod = request.method;
        let auditAction;
        switch (httpMethod) {
            case 'POST':
                auditAction = audit_action_enum_1.AuditAction.CREATE;
                break;
            case 'GET':
                auditAction = audit_action_enum_1.AuditAction.READ;
                break;
            case 'PUT':
            case 'PATCH':
                auditAction = audit_action_enum_1.AuditAction.UPDATE;
                break;
            case 'DELETE':
                auditAction = audit_action_enum_1.AuditAction.DELETE;
                break;
            default:
                auditAction = audit_action_enum_1.AuditAction.READ;
        }
        const resourceId = request.params?.id;
        const auditDetails = {
            method: httpMethod,
            url: request.url,
            userAgent: request.headers['user-agent'],
            ip: request.ip,
            params: request.params,
            query: request.query,
            body: this.sanitizeBody(request.body),
        };
        return next.handle().pipe((0, operators_1.tap)({
            next: (response) => {
                this.auditService.createAuditLog(user.userId, auditAction, entity, resourceId, {
                    ...auditDetails,
                    success: true,
                    responseStatus: 'success',
                });
            },
            error: (error) => {
                this.auditService.createAuditLog(user.userId, auditAction, entity, resourceId, {
                    ...auditDetails,
                    success: false,
                    error: error.message,
                    responseStatus: 'error',
                });
            },
        }));
    }
    sanitizeBody(body) {
        if (!body || typeof body !== 'object') {
            return body;
        }
        const sensitiveFields = ['password', 'token', 'secret', 'key'];
        const sanitized = { ...body };
        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        }
        return sanitized;
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        core_1.Reflector])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map