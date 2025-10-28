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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Некорректный email адрес' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email обязателен' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Пароль должен быть строкой' }),
    (0, class_validator_1.MinLength)(6, { message: 'Пароль должен содержать минимум 6 символов' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Пароль обязателен' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Полное имя должно быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Полное имя обязательно' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['ADMIN', 'CURATOR', 'CLIENT', 'CANDIDATE'], { message: 'Недопустимая роль' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Роль обязательна' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Пароль администратора должен быть строкой' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "adminPassword", void 0);
//# sourceMappingURL=register.dto.js.map