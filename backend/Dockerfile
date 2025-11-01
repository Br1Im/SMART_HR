# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем OpenSSL для Prisma
RUN apk add --no-cache openssl

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci && npm cache clean --force

# Копируем исходный код
COPY . .

# Устанавливаем права на выполнение для node_modules/.bin
RUN chmod -R 755 node_modules/.bin

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем проект с подробным выводом
RUN npm run build

# Проверяем, что dist создался
RUN ls -la /app/dist/

# Открываем порт
EXPOSE 3001

# Запускаем приложение
CMD ["npm", "run", "start:prod"]