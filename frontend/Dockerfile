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

# Добавляем node_modules/.bin в PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Устанавливаем права доступа для исполняемых файлов
RUN chmod +x /app/node_modules/.bin/*

# Открываем порт
EXPOSE 3000

# Команда для запуска в режиме разработки
CMD ["npm", "run", "dev"]