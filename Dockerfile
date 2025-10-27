# Этот Dockerfile устарел. Используйте docker-compose.yml для запуска проекта
# или отдельные Dockerfile в папках backend/ и frontend/

FROM node:18-alpine

WORKDIR /app

# Этот файл оставлен для совместимости
# Рекомендуется использовать: docker-compose up

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["echo", "Используйте docker-compose up для запуска проекта"]