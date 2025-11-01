# Frontend Dockerfile
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactjs -u 1001

# Устанавливаем зависимости
RUN npm ci && npm cache clean --force

# Копируем исходный код
COPY . .

# Меняем владельца файлов и устанавливаем правильные права
RUN chown -R reactjs:nodejs /app && \
    chmod -R 755 /app/node_modules/.bin
USER reactjs

# Открываем порт
EXPOSE 3000

# Команда для запуска в режиме разработки
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]