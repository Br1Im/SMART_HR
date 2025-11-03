-- Удаление старых тестовых аккаунтов
DELETE FROM users WHERE email IN (
    'admin@smartcourse.ru',
    'curator@smartcourse.ru', 
    'manager@smartcourse.ru',
    'client@smartcourse.ru',
    'test@example.com'
);