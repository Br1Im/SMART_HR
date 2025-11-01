#!/bin/bash

# Скрипт развертывания приложения SmartCourse
# Запускать от root в директории /var/www/hr-course

echo "🚀 Начинаем развертывание приложения SmartCourse..."

# Переходим в рабочую директорию
cd /var/www/hr-course

# Клонируем репозиторий (если еще не клонирован)
if [ ! -d "SMART_HR" ]; then
    echo "📥 Клонируем репозиторий..."
    git clone https://github.com/Br1Im/SMART_HR.git
else
    echo "📥 Обновляем репозиторий..."
    cd SMART_HR
    git pull origin master
    cd ..
fi

# Переходим в директорию проекта
cd SMART_HR

# Создаем production docker-compose файл
echo "🔧 Создаем production конфигурацию..."
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  # База данных PostgreSQL
  database:
    image: postgres:15-alpine
    container_name: smartcourse-db
    environment:
      POSTGRES_DB: smartcourse
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: SmartCourse2024!SecureDB
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/prisma/migrations:/docker-entrypoint-initdb.d
    networks:
      - smartcourse-network
    restart: unless-stopped

  # Backend сервис
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: smartcourse-backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:SmartCourse2024!SecureDB@database:5432/smartcourse
      - JWT_SECRET=SmartCourse2024!SuperSecretJWTKey!ChangeInProduction!
      - JWT_EXPIRES_IN=7d
      - PORT=3001
    ports:
      - "127.0.0.1:3001:3001"
    depends_on:
      - database
    networks:
      - smartcourse-network
    restart: unless-stopped
    volumes:
      - ./backend/uploads:/app/uploads

  # Frontend сервис
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: smartcourse-frontend
    environment:
      - VITE_API_URL=https://hr-course.ru/api
    ports:
      - "127.0.0.1:3000:80"
    depends_on:
      - backend
    networks:
      - smartcourse-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  smartcourse-network:
    driver: bridge
EOF

# Создаем production Dockerfile для фронтенда
echo "🔧 Создаем production Dockerfile для фронтенда..."
cat > frontend/Dockerfile.prod << 'EOF'
# Multi-stage build для production
FROM node:18-alpine as builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production --silent

# Копируем исходный код
COPY . .

# Устанавливаем права на выполнение для node_modules/.bin
RUN chmod -R +x node_modules/.bin

# Собираем проект
RUN npm run build

# Production stage с Nginx
FROM nginx:alpine

# Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
EOF

# Создаем конфигурацию nginx для контейнера
echo "🔧 Создаем nginx конфигурацию для контейнера..."
cat > frontend/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        # Handle client routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

# Останавливаем старые контейнеры (если есть)
echo "🛑 Останавливаем старые контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Собираем и запускаем новые контейнеры
echo "🔨 Собираем и запускаем контейнеры..."
docker-compose -f docker-compose.prod.yml up --build -d

# Ждем запуска сервисов
echo "⏳ Ждем запуска сервисов..."
sleep 30

# Проверяем статус
echo "📊 Проверяем статус контейнеров..."
docker-compose -f docker-compose.prod.yml ps

# Инициализируем базу данных
echo "🗄️ Инициализируем базу данных..."
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma db seed

echo "✅ Развертывание приложения завершено!"
echo "🌐 Приложение доступно на http://localhost:3000"
echo "🔗 API доступно на http://localhost:3001"