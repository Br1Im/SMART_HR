#!/bin/bash

# 🎛️ Скрипт управления SmartCourse
APP_DIR="/var/www/hr-course/SMART_HR"
COMPOSE_FILE="docker-compose.prod.yml"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция вывода с цветом
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Проверка директории
check_directory() {
    if [ ! -d "$APP_DIR" ]; then
        print_error "Директория приложения не найдена: $APP_DIR"
        exit 1
    fi
    cd "$APP_DIR"
}

# Показать помощь
show_help() {
    print_header "🎛️  SmartCourse Management Tool"
    echo ""
    echo "Использование: bash manage.sh [команда]"
    echo ""
    echo "Доступные команды:"
    echo "  start      - Запустить все сервисы"
    echo "  stop       - Остановить все сервисы"
    echo "  restart    - Перезапустить все сервисы"
    echo "  status     - Показать статус сервисов"
    echo "  logs       - Показать логи всех сервисов"
    echo "  logs-f     - Показать логи в реальном времени"
    echo "  update     - Обновить приложение из Git"
    echo "  rebuild    - Пересобрать и перезапустить"
    echo "  backup     - Создать резервную копию БД"
    echo "  restore    - Восстановить БД из резервной копии"
    echo "  clean      - Очистить неиспользуемые Docker образы"
    echo "  health     - Проверить здоровье приложения"
    echo "  ssl        - Обновить SSL сертификат"
    echo "  nginx      - Управление Nginx (start|stop|restart|status)"
    echo ""
    echo "Примеры:"
    echo "  bash manage.sh start"
    echo "  bash manage.sh logs backend"
    echo "  bash manage.sh nginx restart"
}

# Запуск сервисов
start_services() {
    print_status "Запуск сервисов SmartCourse..."
    check_directory
    docker-compose -f $COMPOSE_FILE up -d
    print_status "Сервисы запущены!"
}

# Остановка сервисов
stop_services() {
    print_status "Остановка сервисов SmartCourse..."
    check_directory
    docker-compose -f $COMPOSE_FILE down
    print_status "Сервисы остановлены!"
}

# Перезапуск сервисов
restart_services() {
    print_status "Перезапуск сервисов SmartCourse..."
    check_directory
    docker-compose -f $COMPOSE_FILE restart
    print_status "Сервисы перезапущены!"
}

# Статус сервисов
show_status() {
    print_header "📊 Статус сервисов SmartCourse"
    check_directory
    docker-compose -f $COMPOSE_FILE ps
    echo ""
    print_header "🌐 Статус Nginx"
    systemctl status nginx --no-pager -l
}

# Показать логи
show_logs() {
    check_directory
    if [ -n "$2" ]; then
        print_status "Показ логов сервиса: $2"
        docker-compose -f $COMPOSE_FILE logs "$2"
    else
        print_status "Показ логов всех сервисов"
        docker-compose -f $COMPOSE_FILE logs
    fi
}

# Показать логи в реальном времени
show_logs_follow() {
    check_directory
    if [ -n "$2" ]; then
        print_status "Отслеживание логов сервиса: $2"
        docker-compose -f $COMPOSE_FILE logs -f "$2"
    else
        print_status "Отслеживание логов всех сервисов"
        docker-compose -f $COMPOSE_FILE logs -f
    fi
}

# Обновление приложения
update_app() {
    print_status "Обновление приложения из Git..."
    check_directory
    
    # Сохранить текущую ветку
    current_branch=$(git branch --show-current)
    print_status "Текущая ветка: $current_branch"
    
    # Получить обновления
    git fetch origin
    git pull origin $current_branch
    
    if [ $? -eq 0 ]; then
        print_status "Код обновлен успешно!"
        print_warning "Для применения изменений выполните: bash manage.sh rebuild"
    else
        print_error "Ошибка при обновлении кода"
        exit 1
    fi
}

# Пересборка и перезапуск
rebuild_app() {
    print_status "Пересборка и перезапуск приложения..."
    check_directory
    
    # Остановить сервисы
    docker-compose -f $COMPOSE_FILE down
    
    # Пересобрать образы
    docker-compose -f $COMPOSE_FILE build --no-cache
    
    # Запустить сервисы
    docker-compose -f $COMPOSE_FILE up -d
    
    print_status "Приложение пересобрано и перезапущено!"
}

# Резервное копирование БД
backup_database() {
    print_status "Создание резервной копии базы данных..."
    check_directory
    
    # Создать директорию для бэкапов
    mkdir -p backups
    
    # Имя файла с датой
    backup_file="backups/smartcourse_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # Создать бэкап
    docker-compose -f $COMPOSE_FILE exec -T database pg_dump -U smartcourse smartcourse > "$backup_file"
    
    if [ $? -eq 0 ]; then
        print_status "Резервная копия создана: $backup_file"
    else
        print_error "Ошибка при создании резервной копии"
        exit 1
    fi
}

# Восстановление БД
restore_database() {
    if [ -z "$2" ]; then
        print_error "Укажите файл резервной копии: bash manage.sh restore backup_file.sql"
        exit 1
    fi
    
    backup_file="$2"
    if [ ! -f "$backup_file" ]; then
        print_error "Файл резервной копии не найден: $backup_file"
        exit 1
    fi
    
    print_warning "ВНИМАНИЕ: Это действие перезапишет текущую базу данных!"
    read -p "Продолжить? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Операция отменена"
        exit 0
    fi
    
    print_status "Восстановление базы данных из: $backup_file"
    check_directory
    
    # Восстановить БД
    docker-compose -f $COMPOSE_FILE exec -T database psql -U smartcourse -d smartcourse < "$backup_file"
    
    if [ $? -eq 0 ]; then
        print_status "База данных восстановлена успешно!"
    else
        print_error "Ошибка при восстановлении базы данных"
        exit 1
    fi
}

# Очистка Docker
clean_docker() {
    print_status "Очистка неиспользуемых Docker образов..."
    docker system prune -f
    docker image prune -f
    print_status "Очистка завершена!"
}

# Проверка здоровья
health_check() {
    print_header "🏥 Проверка здоровья приложения"
    
    # Запустить скрипт проверки статуса
    if [ -f "check-status.sh" ]; then
        bash check-status.sh
    else
        print_warning "Скрипт check-status.sh не найден"
        show_status
    fi
}

# Обновление SSL
update_ssl() {
    print_status "Обновление SSL сертификата..."
    
    # Обновить сертификат
    certbot renew
    
    if [ $? -eq 0 ]; then
        print_status "SSL сертификат обновлен!"
        systemctl reload nginx
        print_status "Nginx перезагружен"
    else
        print_error "Ошибка при обновлении SSL сертификата"
        exit 1
    fi
}

# Управление Nginx
manage_nginx() {
    if [ -z "$2" ]; then
        print_error "Укажите действие: start|stop|restart|status|reload"
        exit 1
    fi
    
    action="$2"
    case $action in
        start)
            print_status "Запуск Nginx..."
            systemctl start nginx
            ;;
        stop)
            print_status "Остановка Nginx..."
            systemctl stop nginx
            ;;
        restart)
            print_status "Перезапуск Nginx..."
            systemctl restart nginx
            ;;
        reload)
            print_status "Перезагрузка конфигурации Nginx..."
            systemctl reload nginx
            ;;
        status)
            print_header "📊 Статус Nginx"
            systemctl status nginx --no-pager -l
            ;;
        *)
            print_error "Неизвестное действие: $action"
            print_error "Доступные действия: start|stop|restart|status|reload"
            exit 1
            ;;
    esac
}

# Основная логика
case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$@"
        ;;
    logs-f)
        show_logs_follow "$@"
        ;;
    update)
        update_app
        ;;
    rebuild)
        rebuild_app
        ;;
    backup)
        backup_database
        ;;
    restore)
        restore_database "$@"
        ;;
    clean)
        clean_docker
        ;;
    health)
        health_check
        ;;
    ssl)
        update_ssl
        ;;
    nginx)
        manage_nginx "$@"
        ;;
    help|--help|-h)
        show_help
        ;;
    "")
        show_help
        ;;
    *)
        print_error "Неизвестная команда: $1"
        echo ""
        show_help
        exit 1
        ;;
esac