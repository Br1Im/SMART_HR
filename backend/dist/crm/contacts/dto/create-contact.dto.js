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
exports.CreateContactDto = void 0;
const class_validator_1 = require("class-validator");
class CreateContactDto {
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Полное имя должно быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Полное имя обязательно' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Некорректный email адрес' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Телефон должен быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Должность должна быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Заметки должны быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'Некорректный ID организации' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID организации обязателен' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "orgId", void 0);
//# sourceMappingURL=create-contact.dto.js.map