#!/bin/bash

# Полный скрипт развертывания SmartCourse на сервере
# Запускать от root на чистом Ubuntu сервере

echo "🚀 Начинаем полное развертывание SmartCourse на hr-course.ru"
echo "=================================================="

# Проверяем, что скрипт запущен от root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Этот скрипт должен быть запущен от root"
    echo "Используйте: sudo bash full-deploy.sh"
    exit 1
fi

# Функция для проверки успешности команды
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1 - успешно"
    else
        echo "❌ $1 - ошибка"
        exit 1
    fi
}

# Шаг 1: Установка необходимого ПО
echo "📦 Шаг 1: Установка необходимого ПО..."
apt update && apt upgrade -y
check_status "Обновление системы"

apt install -y curl wget git nano htop unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
check_status "Установка базовых пакетов"

# Установка Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io
check_status "Установка Docker"

# Установка Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
check_status "Установка Docker Compose"

systemctl start docker
systemctl enable docker
check_status "Запуск Docker"

# Установка Nginx
apt install -y nginx
check_status "Установка Nginx"

# Установка Certbot
apt install -y certbot python3-certbot-nginx
check_status "Установка Certbot"

# Шаг 2: Подготовка директорий
echo "📁 Шаг 2: Подготовка директорий..."
mkdir -p /var/www/hr-course
cd /var/www/hr-course
check_status "Создание рабочей директории"

# Шаг 3: Клонирование репозитория
echo "📥 Шаг 3: Клонирование репозитория..."
if [ -d "SMART_HR" ]; then
    echo "Репозиторий уже существует, обновляем..."
    cd SMART_HR
    git pull origin master
    check_status "Обновление репозитория"
else
    git clone https://github.com/Br1Im/SMART_HR.git
    check_status "Клонирование репозитория"
    cd SMART_HR
fi

# Шаг 4: Создание production конфигурации
echo "🔧 Шаг 4: Создание production конфигурации..."

# Production docker-compose
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
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
    networks:
      - smartcourse-network
    restart: unless-stopped

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

# Production Dockerfile для фронтенда
cat > frontend/Dockerfile.prod << 'EOF'
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Nginx конфигурация для контейнера
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

        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

check_status "Создание production конфигурации"

# Шаг 5: Сборка и запуск приложения
echo "🔨 Шаг 5: Сборка и запуск приложения..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null
docker-compose -f docker-compose.prod.yml up --build -d
check_status "Запуск приложения"

# Ждем запуска
echo "⏳ Ждем запуска сервисов..."
sleep 45

# Инициализация БД
echo "🗄️ Инициализация базы данных..."
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma db seed
check_status "Инициализация базы данных"

# Шаг 6: Настройка Nginx
echo "🌐 Шаг 6: Настройка Nginx..."

# Временная конфигурация
cat > /etc/nginx/sites-available/hr-course.ru.temp << 'EOF'
server {
    listen 80;
    server_name hr-course.ru www.hr-course.ru;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/hr-course.ru.temp /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
check_status "Настройка временной конфигурации Nginx"

# Шаг 7: Получение SSL сертификата
echo "🔒 Шаг 7: Получение SSL сертификата..."
certbot --nginx -d hr-course.ru -d www.hr-course.ru --non-interactive --agree-tos --email admin@hr-course.ru --redirect

if [ $? -eq 0 ]; then
    echo "✅ SSL сертификат получен"
    
    # Финальная конфигурация с SSL
    cat > /etc/nginx/sites-available/hr-course.ru << 'EOF'
server {
    listen 80;
    server_name hr-course.ru www.hr-course.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hr-course.ru www.hr-course.ru;

    ssl_certificate /etc/letsencrypt/live/hr-course.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hr-course.ru/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        try_files $uri $uri/ @fallback;
    }

    location @fallback {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

    ln -sf /etc/nginx/sites-available/hr-course.ru /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/hr-course.ru.temp
    nginx -t && systemctl reload nginx
    check_status "Финальная настройка Nginx"
else
    echo "⚠️ SSL сертификат не получен, но сайт доступен по HTTP"
fi

# Настройка автообновления сертификата
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Шаг 8: Финальная проверка
echo "🔍 Шаг 8: Финальная проверка..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО УСПЕШНО!"
echo "=================================================="
echo "🌐 Сайт доступен по адресу: https://hr-course.ru"
echo "🔗 API доступно по адресу: https://hr-course.ru/api"
echo "📊 Статус контейнеров:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "📝 Полезные команды:"
echo "  - Просмотр логов: docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Перезапуск: docker-compose -f docker-compose.prod.yml restart"
echo "  - Остановка: docker-compose -f docker-compose.prod.yml down"
echo "  - Обновление: git pull && docker-compose -f docker-compose.prod.yml up --build -d"
echo ""
echo "✅ Готово к использованию!"