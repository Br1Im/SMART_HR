# 🚀 Исправление ошибки развертывания SmartCourse

## Проблема
При развертывании на сервере возникла ошибка:
```
sh: vite: Permission denied
```

## Решение

### Вариант 1: Быстрое исправление (Рекомендуется)

1. **Подключитесь к серверу:**
```bash
ssh root@109.69.17.110
# Пароль: 2ZhtXHee*rmb
```

2. **Перейдите в папку проекта:**
```bash
cd ~/SMART_HR
```

3. **Запустите скрипт быстрого исправления:**
```bash
chmod +x deploy/quick-fix-deploy.sh
bash deploy/quick-fix-deploy.sh
```

### Вариант 2: Ручное исправление

1. **Остановите текущие контейнеры:**
```bash
docker-compose -f docker-compose.prod.yml down
```

2. **Обновите репозиторий:**
```bash
git pull origin main
```

3. **Пересоберите с исправлениями:**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Вариант 3: Полное переразвертывание

1. **Запустите полный скрипт развертывания:**
```bash
bash deploy/full-deploy.sh
```

## Что было исправлено

1. **Dockerfile.prod для frontend:**
   - Добавлена команда `chmod -R +x node_modules/.bin`
   - Исправлены права доступа для исполняемых файлов
   - Улучшена конфигурация Nginx

2. **Nginx конфигурация:**
   - Добавлено gzip сжатие
   - Настроено кеширование статических файлов
   - Добавлены заголовки безопасности

3. **Скрипты развертывания:**
   - Обновлены все скрипты с исправлениями
   - Добавлен скрипт быстрого исправления

## Проверка работы

После развертывания проверьте:

1. **Статус контейнеров:**
```bash
docker-compose -f docker-compose.prod.yml ps
```

2. **Логи приложения:**
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

3. **Доступность приложения:**
   - Frontend: http://hr-course.ru
   - API: http://hr-course.ru/api

## Управление приложением

- **Остановка:** `docker-compose -f docker-compose.prod.yml down`
- **Перезапуск:** `docker-compose -f docker-compose.prod.yml restart`
- **Просмотр логов:** `docker-compose -f docker-compose.prod.yml logs -f [service_name]`

## Контакты

При возникновении проблем обращайтесь к разработчику.