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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentController = void 0;
const common_1 = require("@nestjs/common");
const consent_service_1 = require("./consent.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rbac_guard_1 = require("../auth/guards/rbac.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const resource_decorator_1 = require("../auth/decorators/resource.decorator");
class GiveConsentDto {
}
class WithdrawConsentDto {
}
let ConsentController = class ConsentController {
    constructor(consentService) {
        this.consentService = consentService;
    }
    giveConsent(giveConsentDto, req, ip, userAgent) {
        return this.consentService.giveConsent(req.user.id, giveConsentDto.consentType, ip, userAgent);
    }
    getUserConsents(req) {
        return this.consentService.getUserConsents(req.user.id, req.user.id, req.user.role);
    }
    getSpecificUserConsents(userId, req) {
        return this.consentService.getUserConsents(userId, req.user.id, req.user.role);
    }
    getAllConsents(req, page, limit, consentType) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.consentService.getAllConsents(req.user.id, req.user.role, pageNum, limitNum, consentType);
    }
    getConsentStats(req) {
        return this.consentService.getConsentStats(req.user.id, req.user.role);
    }
    checkConsent(consentType, req) {
        return this.consentService.checkUserConsent(req.user.id, consentType);
    }
};
exports.ConsentController = ConsentController;
__decorate([
    (0, common_1.Post)('give'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER', 'CLIENT', 'CANDIDATE'),
    (0, resource_decorator_1.Resource)('consent'),
    (0, resource_decorator_1.Action)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GiveConsentDto, Object, String, String]),
    __metadata("design:returntype", void 0)
], ConsentController.prototype, "giveConsent", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER', 'CLIENT', 'CANDIDATE'),
    (0, resource_decorator_1.Resource)('consent'),
    (0, resource_decorator_1.Action)('read'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsentController.prototype, "getUserConsents", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, resource_decorator_1.Resource)('consent'),
    (0, resource_decorator_1.Action)('read'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsentController.prototype, "getSpecificUserConsents", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, resource_decorator_1.Resource)('consent'),
    (0, resource_decorator_1.Action)('read'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('consentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ConsentController.prototype, "getAllConsents", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, resource_decorator_1.Resource)('consent'),
    (0, resource_decorator_1.Action)('read'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsentController.prototype, "getConsentStats", null);
__decorate([
    (0, common_1.Get)('check/:consentType'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER', 'CLIENT', 'CANDIDATE'),
    (0, resource_decorator_1.Resource)('consent'),
    (0, resource_decorator_1.Action)('read'),
    __param(0, (0, common_1.Param)('consentType')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsentController.prototype, "checkConsent", null);
exports.ConsentController = ConsentController = __decorate([
    (0, common_1.Controller)('consent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [consent_service_1.ConsentService])
], ConsentController);
//# sourceMappingURL=consent.controller.js.map