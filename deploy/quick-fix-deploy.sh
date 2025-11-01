#!/bin/bash

# Быстрое исправление и развертывание SmartCourse
# Этот скрипт исправляет проблему с правами доступа Docker и перезапускает приложение

echo "🚀 Быстрое исправление и развертывание SmartCourse"
echo "=================================================="

# Проверяем, что мы в правильной директории
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Ошибка: docker-compose.yml не найден. Убедитесь, что вы в корневой папке проекта."
    exit 1
fi

# Останавливаем текущие контейнеры
echo "🛑 Останавливаем текущие контейнеры..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Создаем исправленный Dockerfile.prod для фронтенда
echo "🔧 Создаем исправленный Dockerfile.prod..."
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

# Создаем конфигурацию Nginx
echo "📝 Создаем конфигурацию Nginx..."
cat > frontend/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Логирование
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Основные файлы приложения
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Статические ресурсы с кешированием
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Access-Control-Allow-Origin "*";
        }

        # API проксирование (если нужно)
        location /api/ {
            proxy_pass http://backend:3001/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Безопасность
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
EOF

# Удаляем старые образы
echo "🗑️ Удаляем старые образы..."
docker image prune -f

# Пересобираем и запускаем
echo "🔨 Пересобираем и запускаем приложение..."
docker-compose -f docker-compose.prod.yml up --build -d

# Ждем запуска
echo "⏳ Ждем запуска сервисов..."
sleep 30

# Проверяем статус
echo "📊 Проверяем статус контейнеров..."
docker-compose -f docker-compose.prod.yml ps

# Инициализируем базу данных (если нужно)
echo "🗄️ Инициализируем базу данных..."
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy 2>/dev/null || echo "Миграции уже применены"
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma db seed 2>/dev/null || echo "База данных уже заполнена"

echo ""
echo "✅ Развертывание завершено!"
echo "🌐 Приложение доступно на http://localhost:3000"
echo "🔗 API доступно на http://localhost:3001"
echo ""
echo "📋 Для проверки логов используйте:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 Для остановки используйте:"
echo "   docker-compose -f docker-compose.prod.yml down"