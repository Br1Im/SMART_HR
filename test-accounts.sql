-- Скрипт для создания тестовых аккаунтов
-- Пароль для всех аккаунтов: "password123"
-- Хеш bcrypt для пароля "password123" с salt rounds = 12

INSERT INTO "users" (id, email, password, "fullName", role, "createdAt", "updatedAt") VALUES
-- Системный администратор
('admin-001', 'admin@smartcourse.ru', '$2a$12$j.Tzb1VYgywUhkWatMBGROgi8uPs/Ce1uVOkJ.ag.Nf.O34WadN5O', 'Системный администратор', 'ADMIN', NOW(), NOW()),

-- Куратор курсов  
('curator-001', 'curator@smartcourse.ru', '$2a$12$j.Tzb1VYgywUhkWatMBGROgi8uPs/Ce1uVOkJ.ag.Nf.O34WadN5O', 'Куратор курсов', 'CURATOR', NOW(), NOW()),

-- Менеджер
('manager-001', 'manager@smartcourse.ru', '$2a$12$j.Tzb1VYgywUhkWatMBGROgi8uPs/Ce1uVOkJ.ag.Nf.O34WadN5O', 'Менеджер', 'MANAGER', NOW(), NOW()),

-- Клиент компании
('client-001', 'client@smartcourse.ru', '$2a$12$j.Tzb1VYgywUhkWatMBGROgi8uPs/Ce1uVOkJ.ag.Nf.O34WadN5O', 'Клиент компании', 'CLIENT', NOW(), NOW()),

-- Тестовый кандидат
('candidate-001', 'test@example.com', '$2a$12$j.Tzb1VYgywUhkWatMBGROgi8uPs/Ce1uVOkJ.ag.Nf.O34WadN5O', 'Тестовый кандидат', 'CANDIDATE', NOW(), NOW())

ON CONFLICT (email) DO NOTHING;