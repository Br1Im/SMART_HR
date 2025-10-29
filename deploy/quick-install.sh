#!/bin/bash

# 🚀 Быстрая установка SmartCourse
# Этот скрипт скачивает и запускает все необходимые скрипты для развертывания

set -e  # Остановить при ошибке

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
    echo -e "${BLUE}=================================================="
    echo -e "$1"
    echo -e "==================================================${NC}"
}

# Информация о системе
print_header "🚀 БЫСТРАЯ УСТАНОВКА SMARTCOURSE"
echo ""
print_status "Сервер: $(hostname)"
print_status "IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Не удалось определить')"
print_status "ОС: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
print_status "Дата: $(date)"
echo ""

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    print_error "Этот скрипт должен запускаться от имени root"
    print_status "Выполните: sudo bash quick-install.sh"
    exit 1
fi

# URL репозитория
REPO_URL="https://raw.githubusercontent.com/Br1Im/SMART_HR/master/deploy"
SCRIPTS=(
    "install-server.sh"
    "deploy-app.sh"
    "nginx-config.sh"
    "full-deploy.sh"
    "check-status.sh"
    "manage.sh"
)

# Создать рабочую директорию
WORK_DIR="/tmp/smartcourse-deploy"
print_status "Создание рабочей директории: $WORK_DIR"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# Скачать все скрипты
print_header "📥 СКАЧИВАНИЕ СКРИПТОВ"
for script in "${SCRIPTS[@]}"; do
    print_status "Скачивание $script..."
    if curl -fsSL "$REPO_URL/$script" -o "$script"; then
        chmod +x "$script"
        print_status "✅ $script скачан и сделан исполняемым"
    else
        print_error "❌ Не удалось скачать $script"
        exit 1
    fi
done

echo ""
print_status "Все скрипты успешно скачаны!"

# Показать меню
show_menu() {
    print_header "🎯 ВЫБЕРИТЕ ДЕЙСТВИЕ"
    echo ""
    echo "1) 🚀 Полное развертывание (рекомендуется)"
    echo "   - Установит все необходимое ПО"
    echo "   - Клонирует репозиторий"
    echo "   - Настроит домен hr-course.ru"
    echo "   - Настроит SSL сертификат"
    echo ""
    echo "2) 🔧 Пошаговая установка"
    echo "   - Установка ПО"
    echo "   - Развертывание приложения"
    echo "   - Настройка Nginx и SSL"
    echo ""
    echo "3) 📊 Проверка статуса"
    echo "   - Проверить текущее состояние"
    echo ""
    echo "4) ❌ Выход"
    echo ""
    read -p "Введите номер (1-4): " choice
}

# Полное развертывание
full_deployment() {
    print_header "🚀 ЗАПУСК ПОЛНОГО РАЗВЕРТЫВАНИЯ"
    print_warning "Это займет несколько минут..."
    echo ""
    
    if bash full-deploy.sh; then
        print_header "🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО УСПЕШНО!"
        echo ""
        print_status "🌐 Ваш сайт доступен по адресу: https://hr-course.ru"
        print_status "🔧 Для управления используйте: bash manage.sh"
        echo ""
        
        # Копировать скрипты в финальную директорию
        if [ -d "/var/www/hr-course/SMART_HR" ]; then
            print_status "Копирование скриптов управления..."
            cp manage.sh check-status.sh /var/www/hr-course/SMART_HR/
            print_status "✅ Скрипты скопированы в /var/www/hr-course/SMART_HR/"
        fi
        
        # Запустить проверку статуса
        echo ""
        print_status "Запуск проверки статуса..."
        bash check-status.sh
        
    else
        print_error "❌ Ошибка при развертывании!"
        print_status "Проверьте логи выше для диагностики проблемы"
        exit 1
    fi
}

# Пошаговая установка
step_by_step() {
    print_header "🔧 ПОШАГОВАЯ УСТАНОВКА"
    
    echo ""
    echo "Шаг 1: Установка необходимого ПО"
    read -p "Продолжить? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        bash install-server.sh
    else
        print_status "Шаг пропущен"
    fi
    
    echo ""
    echo "Шаг 2: Развертывание приложения"
    read -p "Продолжить? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        bash deploy-app.sh
    else
        print_status "Шаг пропущен"
    fi
    
    echo ""
    echo "Шаг 3: Настройка Nginx и SSL"
    read -p "Продолжить? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        bash nginx-config.sh
    else
        print_status "Шаг пропущен"
    fi
    
    print_header "✅ ПОШАГОВАЯ УСТАНОВКА ЗАВЕРШЕНА"
}

# Проверка статуса
check_status() {
    print_header "📊 ПРОВЕРКА СТАТУСА СИСТЕМЫ"
    bash check-status.sh
}

# Основной цикл
while true; do
    show_menu
    
    case $choice in
        1)
            full_deployment
            break
            ;;
        2)
            step_by_step
            break
            ;;
        3)
            check_status
            echo ""
            read -p "Нажмите Enter для продолжения..."
            ;;
        4)
            print_status "Выход из программы"
            break
            ;;
        *)
            print_error "Неверный выбор. Попробуйте снова."
            echo ""
            ;;
    esac
done

# Очистка
print_status "Очистка временных файлов..."
cd /
rm -rf "$WORK_DIR"

print_header "🎉 ГОТОВО!"
echo ""
print_status "Спасибо за использование SmartCourse!"
print_status "Документация: https://github.com/Br1Im/SMART_HR/blob/master/deploy/README.md"
echo ""