#!/bin/bash

# 🔍 Скрипт проверки статуса SmartCourse
echo "🔍 Проверка статуса развертывания SmartCourse..."
echo "=================================================="

# Проверка Docker
echo "📦 Проверка Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker установлен: $(docker --version)"
    
    # Проверка статуса контейнеров
    echo ""
    echo "📊 Статус контейнеров:"
    cd /var/www/hr-course/SMART_HR 2>/dev/null
    if [ $? -eq 0 ]; then
        docker-compose -f docker-compose.prod.yml ps
    else
        echo "❌ Директория приложения не найдена"
    fi
else
    echo "❌ Docker не установлен"
fi

echo ""
echo "=================================================="

# Проверка Nginx
echo "🌐 Проверка Nginx..."
if command -v nginx &> /dev/null; then
    echo "✅ Nginx установлен: $(nginx -v 2>&1)"
    
    # Статус Nginx
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx запущен"
    else
        echo "❌ Nginx не запущен"
    fi
    
    # Проверка конфигурации
    if nginx -t &> /dev/null; then
        echo "✅ Конфигурация Nginx корректна"
    else
        echo "❌ Ошибка в конфигурации Nginx"
    fi
else
    echo "❌ Nginx не установлен"
fi

echo ""
echo "=================================================="

# Проверка SSL сертификата
echo "🔒 Проверка SSL сертификата..."
if command -v certbot &> /dev/null; then
    echo "✅ Certbot установлен: $(certbot --version 2>&1 | head -n1)"
    
    # Проверка сертификатов
    if certbot certificates 2>/dev/null | grep -q "hr-course.ru"; then
        echo "✅ SSL сертификат для hr-course.ru найден"
        
        # Проверка срока действия
        cert_info=$(certbot certificates 2>/dev/null | grep -A 10 "hr-course.ru")
        echo "$cert_info" | grep "Expiry Date"
    else
        echo "❌ SSL сертификат для hr-course.ru не найден"
    fi
else
    echo "❌ Certbot не установлен"
fi

echo ""
echo "=================================================="

# Проверка портов
echo "🔌 Проверка портов..."
ports=(80 443 3000 3001 5432)
for port in "${ports[@]}"; do
    if netstat -tuln | grep -q ":$port "; then
        echo "✅ Порт $port открыт"
    else
        echo "❌ Порт $port закрыт"
    fi
done

echo ""
echo "=================================================="

# Проверка доступности сайта
echo "🌍 Проверка доступности сайта..."

# Проверка HTTP (должен перенаправлять на HTTPS)
if curl -s -o /dev/null -w "%{http_code}" http://hr-course.ru | grep -q "301\|302"; then
    echo "✅ HTTP перенаправление работает"
else
    echo "❌ HTTP перенаправление не работает"
fi

# Проверка HTTPS
if curl -s -o /dev/null -w "%{http_code}" https://hr-course.ru | grep -q "200"; then
    echo "✅ HTTPS сайт доступен"
else
    echo "❌ HTTPS сайт недоступен"
fi

# Проверка API
if curl -s -o /dev/null -w "%{http_code}" https://hr-course.ru/api/health | grep -q "200"; then
    echo "✅ API доступен"
else
    echo "❌ API недоступен"
fi

echo ""
echo "=================================================="

# Проверка логов
echo "📋 Последние ошибки в логах..."
echo ""
echo "🔴 Ошибки Nginx:"
tail -n 5 /var/log/nginx/error.log 2>/dev/null || echo "Логи Nginx не найдены"

echo ""
echo "🔴 Ошибки Docker:"
cd /var/www/hr-course/SMART_HR 2>/dev/null
if [ $? -eq 0 ]; then
    docker-compose -f docker-compose.prod.yml logs --tail=5 2>/dev/null | grep -i error || echo "Ошибок в логах Docker не найдено"
else
    echo "Директория приложения не найдена"
fi

echo ""
echo "=================================================="

# Итоговый статус
echo "📊 ИТОГОВЫЙ СТАТУС:"
echo ""

# Подсчет успешных проверок
success_count=0
total_checks=8

# Docker
if command -v docker &> /dev/null; then
    ((success_count++))
fi

# Docker containers
cd /var/www/hr-course/SMART_HR 2>/dev/null
if [ $? -eq 0 ] && docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    ((success_count++))
fi

# Nginx installed
if command -v nginx &> /dev/null; then
    ((success_count++))
fi

# Nginx running
if systemctl is-active --quiet nginx; then
    ((success_count++))
fi

# SSL certificate
if command -v certbot &> /dev/null && certbot certificates 2>/dev/null | grep -q "hr-course.ru"; then
    ((success_count++))
fi

# Ports
open_ports=0
for port in 80 443 3000; do
    if netstat -tuln | grep -q ":$port "; then
        ((open_ports++))
    fi
done
if [ $open_ports -eq 3 ]; then
    ((success_count++))
fi

# HTTPS site
if curl -s -o /dev/null -w "%{http_code}" https://hr-course.ru | grep -q "200"; then
    ((success_count++))
fi

# API
if curl -s -o /dev/null -w "%{http_code}" https://hr-course.ru/api/health | grep -q "200"; then
    ((success_count++))
fi

# Результат
percentage=$((success_count * 100 / total_checks))

if [ $percentage -eq 100 ]; then
    echo "🎉 ВСЁ ОТЛИЧНО! Приложение полностью развернуто и работает ($success_count/$total_checks)"
    echo "🌐 Сайт доступен: https://hr-course.ru"
elif [ $percentage -ge 75 ]; then
    echo "✅ ХОРОШО! Основные компоненты работают ($success_count/$total_checks)"
    echo "⚠️  Есть небольшие проблемы, но сайт должен работать"
elif [ $percentage -ge 50 ]; then
    echo "⚠️  ЧАСТИЧНО РАБОТАЕТ ($success_count/$total_checks)"
    echo "🔧 Требуется дополнительная настройка"
else
    echo "❌ ПРОБЛЕМЫ С РАЗВЕРТЫВАНИЕМ ($success_count/$total_checks)"
    echo "🚨 Требуется устранение ошибок"
fi

echo ""
echo "=================================================="
echo "💡 Для получения подробной информации:"
echo "   - Логи приложения: docker-compose -f docker-compose.prod.yml logs -f"
echo "   - Логи Nginx: tail -f /var/log/nginx/error.log"
echo "   - Статус сервисов: systemctl status nginx docker"
echo "=================================================="