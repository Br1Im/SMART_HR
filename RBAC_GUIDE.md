# RBAC (Role-Based Access Control) System Guide

## Обзор

Система RBAC реализована для контроля доступа к ресурсам на основе ролей пользователей. Система включает backend сервис, NestJS guard и frontend HOC.

## Роли и права

### ADMIN
- Полный доступ ко всем ресурсам и действиям
- Может создавать, читать, обновлять и удалять любые данные

### CURATOR
- Полный доступ к CRM ресурсам:
  - **organizations**: create, read, update, delete
  - **contacts**: create, read, update, delete

### CLIENT
- Ограниченный доступ только для чтения:
  - **organizations**: read
  - **contacts**: read

### CANDIDATE
- Ограниченный доступ только для чтения:
  - **organizations**: read
  - **contacts**: read

## Backend Implementation

### RbacService
Расположен в `backend/src/auth/rbac.service.ts`

```typescript
// Проверка доступа
rbacService.canAccess(userRole: string, resource: string, action: string): boolean

// Получение прав роли
rbacService.getPermissions(userRole: string): Permission[]

// Проверка роли пользователя
rbacService.hasRole(user: any, requiredRole: string): boolean

// Проверка доступа к ресурсу с учетом владения
rbacService.canAccessResource(user: any, resource: string, action: string, resourceOwnerId?: string): boolean
```

### RbacGuard
Расположен в `backend/src/auth/guards/rbac.guard.ts`

Автоматически применяется к контроллерам с декораторами:
```typescript
@Roles('ADMIN', 'CURATOR')
@Resource('organizations')
@Action('create')
```

### Декораторы
- `@Roles(...roles)` - указывает разрешенные роли
- `@Resource(resource)` - указывает ресурс
- `@Action(action)` - указывает действие

## Frontend Implementation

### withRole HOC
Расположен в `frontend/src/hoc/withRole.tsx`

```typescript
import { withRole, ROLES } from '../hoc';

// Обертка компонента с проверкой ролей
export default withRole(MyComponent, [ROLES.ADMIN, ROLES.CURATOR]);

// С кастомным fallback
export default withRole(MyComponent, [ROLES.ADMIN], {
  fallback: <div>Access Denied</div>
});
```

### Использование в компонентах
```typescript
// Импорт
import { withRole, ROLES } from '../hoc';

// В конце файла компонента
export default withRole(OrganizationsList, [ROLES.ADMIN, ROLES.CURATOR]);
```

## Примеры использования

### Backend Controller
```typescript
@Controller('organizations')
@UseGuards(JwtAuthGuard, RbacGuard)
export class OrganizationsController {
  
  @Post()
  @Roles('ADMIN', 'CURATOR')
  @Resource('organizations')
  @Action('create')
  create(@Body() dto: CreateOrganizationDto) {
    // Только ADMIN и CURATOR могут создавать организации
  }

  @Get()
  @Roles('ADMIN', 'CURATOR', 'CLIENT', 'CANDIDATE')
  @Resource('organizations')
  @Action('read')
  findAll() {
    // Все роли могут читать организации
  }
}
```

### Frontend Component
```typescript
import React from 'react';
import { withRole, ROLES } from '../hoc';

const OrganizationsList = () => {
  return (
    <div>
      <h1>Organizations</h1>
      {/* Компонент доступен только ADMIN и CURATOR */}
    </div>
  );
};

export default withRole(OrganizationsList, [ROLES.ADMIN, ROLES.CURATOR]);
```

## Тестирование

Для тестирования RBAC системы запустите:
```bash
cd backend
npx ts-node src/auth/rbac/rbac.test.ts
```

Тест проверяет:
- Права доступа для всех ролей
- Корректность ограничений
- Обработку несуществующих ресурсов

## Расширение системы

### Добавление новой роли
1. Добавьте роль в `RbacService.permissions`
2. Обновите `ROLES` в `frontend/src/hoc/withRole.tsx`
3. Обновите типы в `frontend/src/contexts/AuthContext.tsx`

### Добавление нового ресурса
1. Добавьте ресурс в соответствующие роли в `RbacService`
2. Создайте контроллер с RBAC декораторами
3. Оберните frontend компоненты в `withRole` HOC

## Безопасность

- Все API endpoints защищены `RbacGuard`
- Frontend компоненты скрыты для неавторизованных ролей
- Система проверяет права на уровне сервиса и UI
- Поддерживается проверка владения ресурсами для CLIENT роли