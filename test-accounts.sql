-- Скрипт для создания тестовых аккаунтов
-- Пароль для всех аккаунтов: "password123"
-- Хеш bcrypt для пароля "password123" с salt rounds = 12

INSERT INTO "users" (id, email, password, "fullName", role, "createdAt", "updatedAt") VALUES
-- Системный администратор
('admin-001', 'admin@smartcourse.ru', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO6', 'Системный администратор', 'ADMIN', NOW(), NOW()),

-- Куратор курсов  
('curator-001', 'curator@smartcourse.ru', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO6', 'Куратор курсов', 'CURATOR', NOW(), NOW()),

-- Менеджер
('manager-001', 'manager@smartcourse.ru', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO6', 'Менеджер', 'MANAGER', NOW(), NOW()),

-- Клиент компании
('client-001', 'client@smartcourse.ru', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO6', 'Клиент компании', 'CLIENT', NOW(), NOW()),

-- Тестовый кандидат
('candidate-001', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO6', 'Тестовый кандидат', 'CANDIDATE', NOW(), NOW())

ON CONFLICT (email) DO NOTHING;