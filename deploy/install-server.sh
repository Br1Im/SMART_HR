#!/bin/bash

# Скрипт установки необходимого ПО на сервер
# Запускать от root: bash install-server.sh

echo "🚀 Начинаем установку необходимого ПО..."

# Обновляем систему
echo "📦 Обновляем систему..."
apt update && apt upgrade -y

# Устанавливаем основные пакеты
echo "🔧 Устанавливаем основные пакеты..."
apt install -y curl wget git nano htop unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Устанавливаем Docker
echo "🐳 Устанавливаем Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io

# Устанавливаем Docker Compose
echo "🔨 Устанавливаем Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Запускаем Docker
systemctl start docker
systemctl enable docker

# Устанавливаем Nginx
echo "🌐 Устанавливаем Nginx..."
apt install -y nginx

# Устанавливаем Certbot для SSL
echo "🔒 Устанавливаем Certbot..."
apt install -y certbot python3-certbot-nginx

# Создаем директорию для приложения
echo "📁 Создаем директории..."
mkdir -p /var/www/hr-course
cd /var/www/hr-course

# Проверяем установку
echo "✅ Проверяем установку..."
echo "Docker версия: $(docker --version)"
echo "Docker Compose версия: $(docker-compose --version)"
echo "Nginx версия: $(nginx -v)"
echo "Git версия: $(git --version)"

echo "🎉 Установка завершена!"
echo "Теперь можно клонировать репозиторий и запускать приложение."