
# SmartCourse - HR Smart Courses and Quizzes

Полнофункциональная система управления HR-курсами и тестированием с интегрированной CRM системой, аудитом действий пользователей и управлением согласиями (GDPR compliance).

## 🚀 Быстрый старт

### Требования
- Docker и Docker Compose (рекомендуется)
- Или Node.js 18+ и npm/yarn для локальной разработки

## 🐳 Запуск с Docker (Рекомендуется)

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd SmartCourse
   ```

2. **Запустите проект:**
   ```bash
   docker-compose up
   ```

3. **Доступ к приложению:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - База данных: PostgreSQL на порту 5432

4. **Остановка:**
   ```bash
   docker-compose down
   ```

## 💻 Локальная разработка

### Установка и запуск

1. **Установка зависимостей**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend  
   cd frontend && npm install
   ```

2. **Настройка базы данных**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

3. **Запуск приложения**
   ```bash
   # Backend (терминал 1)
   cd backend && npm start
   
   # Frontend (терминал 2)
   cd frontend && npm run dev
   ```

4. **Доступ к приложению**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

## 📋 Функциональность

- ✅ **Аутентификация и авторизация** (JWT, роли пользователей)
- ✅ **CRM система** (организации, контакты)
- ✅ **Система аудита** (логирование действий, статистика)
- ✅ **Управление согласиями** (GDPR compliance)
- ✅ **Современный UI** (Next.js, Tailwind CSS)
- ✅ **RESTful API** (NestJS, Prisma ORM)

## 🛠 Технологии

### Backend
- **NestJS** - Node.js фреймворк
- **Prisma** - ORM для работы с базой данных
- **SQLite** - база данных
- **JWT** - аутентификация
- **TypeScript** - типизация

### Frontend
- **Next.js 14** - React фреймворк
- **NextAuth.js** - аутентификация
- **Tailwind CSS** - стилизация
- **TypeScript** - типизация

## 📖 Документация

Подробное руководство по установке, настройке и использованию доступно в [SETUP.md](./SETUP.md).

## 🎨 Дизайн

Оригинальный дизайн проекта доступен в [Figma](https://www.figma.com/design/5n83aawQhNNLZCVTE2WVhW/HR-Smart-Courses-and-Quizzes).

## 📁 Структура проекта

```
SmartCourse/
├── backend/           # NestJS API сервер
│   ├── src/          # Исходный код
│   ├── prisma/       # Схема базы данных
│   └── dist/         # Скомпилированные файлы
├── frontend/         # Next.js приложение
│   ├── app/          # App Router страницы
│   ├── components/   # React компоненты
│   ├── hooks/        # Custom hooks
│   └── lib/          # Утилиты
└── src/              # Оригинальные компоненты (legacy)
```

## 🔧 Разработка

### Полезные команды

```bash
# Backend
npm run start:dev     # Режим разработки
npm run build         # Сборка
npm run test          # Тесты

# Frontend
npm run dev           # Режим разработки
npm run build         # Сборка
npm run start         # Production сервер

# База данных
npx prisma studio     # GUI для базы данных
npx prisma migrate dev # Создание миграции
```

## 🚨 Статус проекта

✅ **Готово к использованию**
- Backend сервер запущен и работает
- Frontend приложение доступно
- API интеграция настроена
- База данных инициализирована

## 📞 Поддержка

При возникновении проблем:
1. Проверьте [SETUP.md](./SETUP.md) для детальных инструкций
2. Убедитесь, что все зависимости установлены
3. Проверьте логи в консоли разработчика
  