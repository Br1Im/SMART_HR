# Frontend Dockerfile
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci && npm cache clean --force

# Копируем исходный код
COPY . .

# Открываем порт
EXPOSE 3000

# Команда для запуска в режиме разработки
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]