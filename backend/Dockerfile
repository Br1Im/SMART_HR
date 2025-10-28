# Backend Dockerfile
FROM node:18-alpine

# Устанавливаем необходимые зависимости для Prisma
RUN apk add --no-cache openssl

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm ci && npm cache clean --force

# Копируем исходный код
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем проект
RUN npm run build

# Удаляем dev зависимости после сборки
RUN npm ci --only=production && npm cache clean --force

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Меняем владельца файлов
USER nestjs

# Открываем порт
EXPOSE 3001

# Команда для запуска
CMD ["npm", "run", "start:prod"]