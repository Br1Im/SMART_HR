# SmartCourse - Руководство по запуску и использованию

## Описание проекта

SmartCourse - это система управления HR-курсами и тестированием с функциями CRM, аудита и управления согласиями. Проект состоит из двух основных частей:
- **Backend**: NestJS API с базой данных SQLite
- **Frontend**: Next.js приложение с современным UI

## Требования к системе

- Node.js 18+ 
- npm или yarn
- Git

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd SmartCourse
```

### 2. Установка зависимостей

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Настройка переменных окружения

#### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-change-this-in-production"
NODE_ENV=development
```

#### Frontend (.env.local)
```env
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NODE_ENV=development
```

### 4. Инициализация базы данных

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 5. Запуск приложения

#### Запуск Backend (порт 3001)
```bash
cd backend
npm start
```

#### Запуск Frontend (порт 3000)
```bash
cd frontend
npm run dev
```

### 6. Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Health Check**: http://localhost:3001/api/health

## Структура проекта

### Backend (NestJS)
```
backend/
├── src/
│   ├── auth/          # Аутентификация и авторизация
│   ├── audit/         # Система аудита и согласий
│   ├── crm/           # CRM модули (организации, контакты)
│   ├── common/        # Общие компоненты (guards, decorators)
│   └── database/      # Конфигурация базы данных
├── prisma/
│   └── schema.prisma  # Схема базы данных
└── dist/              # Скомпилированные файлы
```

### Frontend (Next.js)
```
frontend/
├── app/               # App Router страницы
│   └── dashboard/     # Защищенные страницы
├── components/        # React компоненты
│   ├── auth/          # Компоненты аутентификации
│   ├── crm/           # CRM компоненты
│   ├── audit/         # Компоненты аудита
│   └── ui/            # UI компоненты
├── hooks/             # Custom React hooks
├── lib/               # Утилиты и API клиент
└── types/             # TypeScript типы
```

## Основные функции

### 1. Аутентификация
- Регистрация и вход пользователей
- JWT токены для авторизации
- Роли пользователей: admin, curator, client, candidate

### 2. CRM система
- **Организации**: создание, редактирование, удаление
- **Контакты**: управление контактами организаций
- Поиск и фильтрация данных

### 3. Система аудита
- Автоматическое логирование действий пользователей
- Отслеживание операций CRUD
- Статистика и отчеты по активности

### 4. Управление согласиями (GDPR)
- Получение согласий на обработку данных
- Отзыв согласий
- История изменений согласий

## API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация
- `GET /api/auth/profile` - Профиль пользователя

### Организации
- `GET /api/organizations` - Список организаций
- `POST /api/organizations` - Создание организации
- `GET /api/organizations/:id` - Получение организации
- `PATCH /api/organizations/:id` - Обновление организации
- `DELETE /api/organizations/:id` - Удаление организации

### Контакты
- `GET /api/contacts` - Список контактов
- `POST /api/contacts` - Создание контакта
- `GET /api/contacts/:id` - Получение контакта
- `PATCH /api/contacts/:id` - Обновление контакта
- `DELETE /api/contacts/:id` - Удаление контакта

### Аудит
- `GET /api/audit` - Журнал аудита
- `GET /api/audit/stats` - Статистика аудита
- `GET /api/audit/:id` - Запись аудита

### Согласия
- `POST /api/consent/give` - Дать согласие
- `GET /api/consent/my` - Мои согласия
- `GET /api/consent/stats` - Статистика согласий

## Разработка

### Команды для разработки

#### Backend
```bash
npm run start:dev    # Запуск в режиме разработки
npm run build        # Сборка проекта
npm run test         # Запуск тестов
```

#### Frontend
```bash
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка проекта
npm run start        # Запуск production сборки
```

### База данных

#### Миграции Prisma
```bash
npx prisma migrate dev    # Создание и применение миграции
npx prisma generate       # Генерация Prisma Client
npx prisma studio         # Открытие Prisma Studio
```

## Устранение неполадок

### Проблемы с запуском

1. **Ошибки компиляции TypeScript**
   - Убедитесь, что все зависимости установлены
   - Проверьте версию Node.js (требуется 18+)

2. **Проблемы с базой данных**
   - Выполните `npx prisma generate`
   - Проверьте права доступа к файлу базы данных

3. **Ошибки подключения API**
   - Убедитесь, что backend запущен на порту 3001
   - Проверьте переменные окружения в `.env.local`

### Логи и отладка

- Backend логи выводятся в консоль
- Frontend ошибки отображаются в браузере и консоли разработчика
- Проверьте Network tab в DevTools для API запросов

## Безопасность

- Измените секретные ключи в production
- Используйте HTTPS в production
- Регулярно обновляйте зависимости
- Не коммитьте файлы с секретами

## Поддержка

Для получения помощи:
1. Проверьте логи приложения
2. Убедитесь, что все зависимости установлены
3. Проверьте переменные окружения
4. Обратитесь к документации API