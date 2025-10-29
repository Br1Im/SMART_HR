#!/bin/bash

# Скрипт настройки Nginx для домена hr-course.ru
# Запускать от root после развертывания приложения

echo "🌐 Настраиваем Nginx для домена hr-course.ru..."

# Создаем конфигурацию сайта
cat > /etc/nginx/sites-available/hr-course.ru << 'EOF'
server {
    listen 80;
    server_name hr-course.ru www.hr-course.ru;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hr-course.ru www.hr-course.ru;

    # SSL configuration (будет настроено certbot)
    ssl_certificate /etc/letsencrypt/live/hr-course.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hr-course.ru/privkey.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # API routes
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
        proxy_read_timeout 86400;
    }

    # Frontend routes
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
        
        # Handle client-side routing
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

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security
    location ~ /\. {
        deny all;
    }
}
EOF

# Создаем временную конфигурацию для получения SSL сертификата
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

# Удаляем дефолтную конфигурацию
rm -f /etc/nginx/sites-enabled/default

# Активируем временную конфигурацию
ln -sf /etc/nginx/sites-available/hr-course.ru.temp /etc/nginx/sites-enabled/

# Проверяем конфигурацию
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Конфигурация Nginx корректна"
    systemctl reload nginx
    echo "🔄 Nginx перезагружен"
else
    echo "❌ Ошибка в конфигурации Nginx"
    exit 1
fi

echo "🔒 Получаем SSL сертификат..."
certbot --nginx -d hr-course.ru -d www.hr-course.ru --non-interactive --agree-tos --email admin@hr-course.ru

if [ $? -eq 0 ]; then
    echo "✅ SSL сертификат получен успешно"
    
    # Активируем основную конфигурацию с SSL
    ln -sf /etc/nginx/sites-available/hr-course.ru /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/hr-course.ru.temp
    
    # Проверяем и перезагружаем
    nginx -t && systemctl reload nginx
    
    echo "🎉 Настройка завершена!"
    echo "🌐 Сайт доступен по адресу: https://hr-course.ru"
else
    echo "❌ Ошибка получения SSL сертификата"
    echo "🔧 Проверьте DNS настройки домена"
fi

# Настраиваем автообновление сертификата
echo "🔄 Настраиваем автообновление SSL сертификата..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "✅ Настройка Nginx завершена!"