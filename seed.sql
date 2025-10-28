-- Создание тестового пользователя (пароль: Test123!)
INSERT INTO "User" (id, email, password, "fullName", role, "createdAt", "updatedAt") 
VALUES ('1', 'test@example.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'Test User', 'ADMIN', NOW(), NOW()) 
ON CONFLICT (id) DO NOTHING;

-- Создание тестового курса
INSERT INTO "Course" (id, title, description, "userId", "createdAt", "updatedAt")
VALUES ('1', 'Тестовый курс', 'Описание тестового курса для проверки блоков', '1', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Создание тестовых блоков для курса
INSERT INTO "Block" (id, title, content, type, position, "courseId", "createdAt", "updatedAt")
VALUES 
('1', 'Введение', 'Содержание вводного блока', 'TEXT', 1, '1', NOW(), NOW()),
('2', 'Видео урок', 'https://example.com/video.mp4', 'VIDEO', 2, '1', NOW(), NOW()),
('3', 'Практическое задание', 'Выполните следующие упражнения...', 'TASK', 3, '1', NOW(), NOW()),
('4', 'Тест', 'Вопросы для проверки знаний', 'QUIZ', 4, '1', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;