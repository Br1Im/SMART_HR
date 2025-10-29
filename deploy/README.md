# 🚀 Инструкция по развертыванию SmartCourse на сервере

## 📋 Информация о сервере
- **IP-адрес**: 109.69.17.110
- **Пользователь**: root
- **Пароль**: 2ZhtXHee*rmb
- **Домен**: hr-course.ru (настроен в DNS)

## 🎯 Быстрое развертывание (Рекомендуется)

### Шаг 1: Подключение к серверу
```bash
ssh root@109.69.17.110
# Введите пароль: 2ZhtXHee*rmb
```

### Шаг 2: Скачивание и запуск скрипта развертывания
```bash
# Скачиваем скрипт развертывания
curl -o full-deploy.sh https://raw.githubusercontent.com/Br1Im/SMART_HR/master/deploy/full-deploy.sh

# Делаем скрипт исполняемым
chmod +x full-deploy.sh

# Запускаем полное развертывание
bash full-deploy.sh
```

**Это всё!** Скрипт автоматически:
- Установит все необходимое ПО (Docker, Nginx, Certbot)
- Клонирует репозиторий
- Соберет и запустит приложение
- Настроит Nginx и SSL сертификат
- Настроит домен hr-course.ru

## 🔧 Ручное развертывание (пошагово)

Если нужно выполнить развертывание вручную:

### 1. Установка ПО
```bash
bash install-server.sh
```

### 2. Развертывание приложения
```bash
bash deploy-app.sh
```

### 3. Настройка Nginx и SSL
```bash
bash nginx-config.sh
```

## 📊 Проверка статуса

После развертывания проверьте статус:

```bash
# Статус контейнеров
cd /var/www/hr-course/SMART_HR
docker-compose -f docker-compose.prod.yml ps

# Логи приложения
docker-compose -f docker-compose.prod.yml logs -f

# Статус Nginx
systemctl status nginx

# Проверка SSL сертификата
certbot certificates
```

## 🌐 Доступ к приложению

После успешного развертывания:
- **Сайт**: https://hr-course.ru
- **API**: https://hr-course.ru/api
- **Админ панель**: https://hr-course.ru/dashboard

## 🔑 Тестовые учетные данные

Для тестирования используйте:
- **Email**: admin@example.com
- **Пароль**: admin123
- **Роль**: ADMIN

## 🛠️ Управление приложением

### Перезапуск сервисов
```bash
cd /var/www/hr-course/SMART_HR
docker-compose -f docker-compose.prod.yml restart
```

### Обновление приложения
```bash
cd /var/www/hr-course/SMART_HR
git pull origin master
docker-compose -f docker-compose.prod.yml up --build -d
```

### Остановка приложения
```bash
cd /var/www/hr-course/SMART_HR
docker-compose -f docker-compose.prod.yml down
```

### Просмотр логов
```bash
cd /var/www/hr-course/SMART_HR

# Все логи
docker-compose -f docker-compose.prod.yml logs -f

# Логи конкретного сервиса
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f database
```

## 🔒 Безопасность

### Изменение паролей (Рекомендуется)
После развертывания измените пароли в файле `docker-compose.prod.yml`:

```yaml
environment:
  - POSTGRES_PASSWORD: ВАШ_НОВЫЙ_ПАРОЛЬ_БД
  - JWT_SECRET: ВАШ_НОВЫЙ_JWT_СЕКРЕТ
```

Затем перезапустите:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Обновление SSL сертификата
Сертификат обновляется автоматически через cron. Для ручного обновления:
```bash
certbot renew
systemctl reload nginx
```

## 🚨 Устранение неполадок

### Проблемы с Docker
```bash
# Перезапуск Docker
systemctl restart docker

# Очистка неиспользуемых образов
docker system prune -a
```

### Проблемы с Nginx
```bash
# Проверка конфигурации
nginx -t

# Перезапуск Nginx
systemctl restart nginx

# Просмотр логов Nginx
tail -f /var/log/nginx/error.log
```

### Проблемы с SSL
```bash
# Проверка сертификатов
certbot certificates

# Принудительное обновление
certbot renew --force-renewal
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи приложения
2. Убедитесь, что все контейнеры запущены
3. Проверьте статус Nginx
4. Проверьте DNS настройки домена

## 🎉 Готово!

После успешного развертывания ваше приложение SmartCourse будет доступно по адресу https://hr-course.ru с полной функциональностью и SSL защитой.